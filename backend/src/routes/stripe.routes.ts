import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripe.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import express from 'express';

const router = Router();

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
