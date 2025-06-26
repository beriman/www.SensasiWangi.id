import { createOrder } from '../../convex/marketplace';

const baseArgs = {
  productId: 'p1',
  shippingAddress: {
    name: 'A',
    phone: '1',
    address: 'addr',
    city: 'c',
    postalCode: '1',
    province: 'x',
  },
  origin: 'c',
  destination: 'c',
  shippingMethod: 'JNE',
  shippingCost: 1000,
  paymentMethod: 'transfer',
};

describe('createOrder', () => {
  it('throws when unauthenticated', async () => {
    const ctx = { auth: { getUserIdentity: jest.fn().mockResolvedValue(null) } } as any;
    await expect(createOrder._handler(ctx, baseArgs as any)).rejects.toThrow('Anda harus login');
  });

  it('throws when product missing', async () => {
    const ctx = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 't' }) },
      db: {
        query: jest.fn().mockReturnValue({ withIndex: () => ({ unique: jest.fn().mockResolvedValue({ _id: 'u1' }) }) }),
        get: jest.fn().mockResolvedValue(null),
      },
    } as any;
    await expect(createOrder._handler(ctx, baseArgs as any)).rejects.toThrow('Produk tidak ditemukan');
  });
});
