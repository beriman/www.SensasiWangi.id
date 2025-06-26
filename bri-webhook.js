import { api } from './convex/_generated/api.js';

export function createBriWebhookHandler(convex) {
  return async function briWebhookHandler(req, res) {
    try {
      const { eventType, orderId } = req.body || {};
      if (!eventType) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      await convex.mutation(api.webhooks.logBriEvent, {
        eventType,
        orderId,
        rawBody: JSON.stringify(req.body),
      });

      if (eventType === 'payment_success' && orderId) {
        await convex.mutation(api.marketplace.verifyOrderPayment, { orderId });
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}
