import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      if (userId && subscriptionId && customerId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Extract plan details
        const plan = subscription.items.data[0].price?.lookup_key || 'default_plan'; // Or map to a specific plan name
        const amount = subscription.items.data[0].price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0; // Amount in cents, convert to dollars
        const startedAt = new Date(subscription.start_date * 1000);

        let endsAt: Date 
        if (!subscription.cancel_at){
          endsAt = new Date() 
        } else {
          endsAt = new Date(subscription.cancel_at * 1000);
        }

        await prisma.subscription.create({
          data: {
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan: plan,
            amount: amount,
            started_at: startedAt,
            ends_at: endsAt,
            last_payment_at: startedAt,
          },
        });
        await prisma.user.update({
          where: { id: userId },
          data: { subscription_status: subscription.status },
        });
      }
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionIdFromInvoice = invoice.id as string | null;

      if (subscriptionIdFromInvoice) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionIdFromInvoice);
        await prisma.subscription.update({
          where: { stripe_subscription_id: subscriptionIdFromInvoice },
          data: {
            status: subscription.status,
            ends_at: new Date(subscription.cancel_at! * 1000),
            last_payment_at: new Date(invoice.created * 1000),
          },
        });
        // Optionally update user's subscription status here if needed
      }
      break;
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      if (updatedSubscription.id) {
        const plan = updatedSubscription.items.data[0].price?.lookup_key || 'default_plan';
        const amount = updatedSubscription.items.data[0].price?.unit_amount ? updatedSubscription.items.data[0].price.unit_amount / 100 : 0;
        await prisma.subscription.update({
          where: { stripe_subscription_id: updatedSubscription.id },
          data: {
            status: updatedSubscription.status,
            plan: plan,
            amount: amount,
            started_at: new Date(updatedSubscription.start_date * 1000),
            ends_at: new Date(updatedSubscription.cancel_at! * 1000),
          },
        });
        // Optionally update user's subscription status here if needed
      }
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      if (deletedSubscription.id) {
        await prisma.subscription.update({
          where: { stripe_subscription_id: deletedSubscription.id },
          data: {
            status: 'canceled', // Or a specific enum value for canceled
            ends_at: new Date(), // Set to now or the end of the current period
          },
        });
        // Optionally update user's subscription status here if needed
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
