import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

const request = require('supertest');
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
// use require to avoid ESM interop issues in Jest
const express = require('express');
import { createBriWebhookHandler } from '../../bri-webhook.js';

let app: any;

beforeAll(async () => {
  process.env.CONVEX_URL = 'http://localhost';
  process.env.NODE_ENV = 'test';
  const convex = new ConvexHttpClient('http://localhost');
  const briWebhookHandler = createBriWebhookHandler(convex);
  app = express();
  app.use(express.json());
  app.post('/api/bri/webhook', briWebhookHandler);
});

jest.mock('convex/browser');

const mockMutation = jest.fn();
(ConvexHttpClient as unknown as jest.Mock).mockImplementation(() => ({
  mutation: mockMutation,
}));

describe('BRI webhook', () => {
  it('logs event and verifies payment', async () => {
    mockMutation.mockResolvedValueOnce(null); // log
    mockMutation.mockResolvedValueOnce(null); // verify

    await request(app)
      .post('/api/bri/webhook')
      .send({ eventType: 'payment_success', orderId: 'o1' })
      .expect(200);

    expect(mockMutation).toHaveBeenNthCalledWith(
      1,
      api.webhooks.logBriEvent,
      expect.objectContaining({
        eventType: 'payment_success',
        orderId: 'o1',
      })
    );
    expect(mockMutation).toHaveBeenNthCalledWith(2, api.marketplace.verifyOrderPayment, { orderId: 'o1' });
  });
});
