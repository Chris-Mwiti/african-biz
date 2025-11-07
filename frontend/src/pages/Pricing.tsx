import { toast } from 'sonner';
import { createCheckoutSession } from '../services/payment.service';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const { user } = useAuth();

  const handleCheckout = (plan: string) => {
    setSelectedPlan(plan);
    setCheckoutDialog(true);
  };

  const processPayment = async () => {
    if (!user || !user.id) {
      toast.error('You must be logged in to subscribe.');
      return;
    }

    const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);
    if (!selectedPlanDetails) {
      toast.error('Selected plan not found.');
      return;
    }

    // Placeholder for Stripe Price IDs - these would come from your Stripe dashboard
    // You'd likely have a mapping of your plan IDs to Stripe Price IDs
    const priceIdMap: { [key: string]: { monthly: string; yearly: string } } = {
      'basic': { monthly: 'price_1Pxxxxxxxxxxxxxx', yearly: 'price_1Pxxxxxxxxxxxxxx' },
      'standard': { monthly: 'price_1Pxxxxxxxxxxxxxx', yearly: 'price_1Pxxxxxxxxxxxxxx' },
      'premium': { monthly: 'price_1Pxxxxxxxxxxxxxx', yearly: 'price_1Pxxxxxxxxxxxxxx' },
    };

    const stripePriceId = priceIdMap[selectedPlanDetails.id]?.[billingPeriod];

    if (!stripePriceId) {
      toast.error('Stripe Price ID not configured for this plan.');
      return;
    }

    try {
      toast.info('Redirecting to Stripe checkout...');
      setCheckoutDialog(false);
      const checkoutUrl = await createCheckoutSession({
        priceId: stripePriceId,
        userId: user.id,
      });
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error('Failed to initiate checkout. Please try again.');
      console.error('Checkout initiation error:', error);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for getting started',
      price: { monthly: 10, yearly: 100 },
      features: [
        'Create 1 business listing',
        'Appear in Find Listings page',
        'Basic analytics (total views)',
        'Email support',
        'Standard search ranking',
        'Business contact information',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Great for growing businesses',
      price: { monthly: 15, yearly: 150 },
      features: [
        'Everything in Basic',
        'Create up to 3 business listings',
        'Enhanced listing visibility',
        'Social media links',
        'Business hours display',
        'Customer reviews enabled',
        'Priority email support',
      ],
      cta: 'Choose Standard',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For serious entrepreneurs',
      price: { monthly: 29, yearly: 290 },
      features: [
        'Everything in Standard',
        'Featured on Home page carousel',
        'Priority search ranking',
        'Unlimited business listings',
        'Unlimited events and blog posts',
        'Advanced analytics dashboard',
        'Views, clicks, and contact tracking',
        'Verified business badge',
        'Social media integration',
        'Priority support',
      ],
      cta: 'Upgrade to Premium',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4">Choose Your Plan</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Start free and upgrade when you're ready to grow your visibility
            </p>

            {/* Billing Toggle */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <Label htmlFor="billing" className={billingPeriod === 'monthly' ? '' : 'text-muted-foreground'}>
                Monthly
              </Label>
              <Switch
                id="billing"
                checked={billingPeriod === 'yearly'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="billing" className={billingPeriod === 'yearly' ? '' : 'text-muted-foreground'}>
                Yearly
              </Label>
              {billingPeriod === 'yearly' && (
                <Badge className="bg-accent text-accent-foreground">Save 17%</Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Crown className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  <CardTitle className="mb-2">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold">
                        ${plan.price[billingPeriod]}
                      </span>
                      {plan.price[billingPeriod] > 0 && (
                        <span className="text-muted-foreground">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        ${(plan.price.yearly / 12).toFixed(0)}/month billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.id === 'premium' && <Zap className="mr-2 h-5 w-5" />}
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="mb-2">Can I upgrade or downgrade at any time?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade to Premium at any time. If you downgrade, changes will take effect
                at the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and digital wallets through Stripe,
                our secure payment processor.
              </p>
            </div>

            <div>
              <h3 className="mb-2">Is there a commitment period?</h3>
              <p className="text-muted-foreground">
                No! You can cancel your Premium subscription at any time. You'll continue to have
                access until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="mb-2">What happens if I cancel or downgrade?</h3>
              <p className="text-muted-foreground">
                If you cancel Premium, your listing will remain in Find Listings with Standard or Basic features.
                You'll lose access to premium features like homepage carousel, events, and advanced analytics.
              </p>
            </div>
            
            <div>
              <h3 className="mb-2">What's the difference between plans?</h3>
              <p className="text-muted-foreground">
                Basic ($10/mo) gives you a single listing with standard features. Standard ($15/mo) adds
                multiple listings and enhanced visibility. Premium ($29/mo) includes everything plus homepage
                featuring, unlimited content, and advanced analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialog} onOpenChange={setCheckoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              You'll be redirected to our secure payment processor, Stripe, to complete your purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {selectedPlan === 'premium' ? 'Premium Plan' : 
                       selectedPlan === 'standard' ? 'Standard Plan' : 'Basic Plan'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {billingPeriod === 'monthly' ? 'Monthly' : 'Annual'} billing
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${selectedPlan === 'premium' 
                        ? (billingPeriod === 'monthly' ? '29' : '290')
                        : selectedPlan === 'standard'
                        ? (billingPeriod === 'monthly' ? '15' : '150')
                        : (billingPeriod === 'monthly' ? '10' : '100')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-muted bg-muted/30 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Check className="h-4 w-4 text-accent" />
                Secure payment via Stripe
              </p>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCheckoutDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={processPayment}>
                Continue to Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
