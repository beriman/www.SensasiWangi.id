import express from 'express';
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error('CONVEX_URL environment variable not set');
  process.exit(1);
}

const convex = new ConvexHttpClient(convexUrl);
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/api/brands', async (req, res) => {
  try {
    const result = await convex.query(api.marketplace.getIndonesianBrands, {
      paginationOpts: { numItems: parseInt(req.query.limit) || 50, cursor: req.query.cursor || null },
      category: req.query.category,
      sortBy: req.query.sortBy,
      searchQuery: req.query.search,
      city: req.query.city,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/perfumers', async (req, res) => {
  try {
    const result = await convex.query(api.marketplace.getIndonesianPerfumers, {
      paginationOpts: { numItems: parseInt(req.query.limit) || 50, cursor: req.query.cursor || null },
      experience: req.query.experience,
      specialty: req.query.specialty,
      sortBy: req.query.sortBy,
      searchQuery: req.query.search,
      city: req.query.city,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/fragrances', async (req, res) => {
  try {
    const result = await convex.query(api.marketplace.getIndonesianFragrances, {
      paginationOpts: { numItems: parseInt(req.query.limit) || 50, cursor: req.query.cursor || null },
      category: req.query.category,
      concentration: req.query.concentration,
      gender: req.query.gender,
      brandId: req.query.brandId,
      perfumerId: req.query.perfumerId,
      sortBy: req.query.sortBy,
      searchQuery: req.query.search,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await convex.query(api.marketplace.getDatabaseStats, {});
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bri/callback', async (req, res) => {
  try {
    const { orderId, status } = req.body || {};
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    await convex.mutation(api.marketplace.updatePaymentStatus, {
      orderId,
      paymentStatus: status,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bri/qris-callback', async (req, res) => {
  try {
    const { orderId, status } = req.body || {};
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    await convex.mutation(api.marketplace.updatePaymentStatus, {
      orderId,
      paymentStatus: status,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
