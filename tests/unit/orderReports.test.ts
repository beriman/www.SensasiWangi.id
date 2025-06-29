import { submitOrderReport, resolveOrderReport } from '../../convex/marketplace';

describe('order reports', () => {
  it('requires auth to submit', async () => {
    const ctx = { auth: { getUserIdentity: jest.fn().mockResolvedValue(null) } } as any;
    await expect(
      submitOrderReport._handler(ctx, { orderId: 'o1' as any, reason: 'x' })
    ).rejects.toThrow('Anda harus login');
  });

  it('creates report', async () => {
    const ctx: any = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'tok' }) },
      db: {
        query: jest.fn().mockReturnValue({
          withIndex: () => ({ unique: jest.fn().mockResolvedValue({ _id: 'u1' }) })
        }),
        insert: jest.fn(),
      },
    };
    await submitOrderReport._handler(ctx, { orderId: 'o1' as any, reason: 'spam' });
    expect(ctx.db.insert).toHaveBeenCalledWith('orderReports', expect.objectContaining({
      orderId: 'o1',
      reporterId: 'u1',
      reason: 'spam',
      status: 'pending',
    }));
  });

  it('resolve requires admin', async () => {
    const ctx: any = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'tok' }) },
      db: {
        query: jest.fn().mockReturnValue({
          withIndex: () => ({ unique: jest.fn().mockResolvedValue({ _id: 'u2', role: 'buyer' }) })
        }),
        patch: jest.fn(),
      },
    };
    await expect(
      resolveOrderReport._handler(ctx, { reportId: 'r1' as any, status: undefined })
    ).rejects.toThrow('Unauthorized');
  });
});
