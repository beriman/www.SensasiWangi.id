import { issueWarning, tempBanUser, permBanUser } from '../../convex/admin';

const createAdminCtx = () => ({
  auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'admin' }) },
  db: {
    query: jest.fn().mockReturnValue({
      withIndex: () => ({ unique: jest.fn().mockResolvedValue({ _id: 'a1', role: 'admin' }) })
    }),
    get: jest.fn().mockResolvedValue({ _id: 'u1', warnings: 0, bannedUntil: 0, role: 'buyer' }),
    patch: jest.fn(),
  },
});

const createUserCtx = () => ({
  auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'user' }) },
  db: {
    query: jest.fn().mockReturnValue({
      withIndex: () => ({ unique: jest.fn().mockResolvedValue({ _id: 'u2', role: 'buyer' }) })
    }),
  },
});

describe('admin moderation', () => {
  it('requires admin role', async () => {
    const ctx = createUserCtx() as any;
    await expect(issueWarning._handler(ctx, { userId: 'u1' } as any)).rejects.toThrow('Unauthorized');
  });

  it('issues warning', async () => {
    const ctx = createAdminCtx() as any;
    await issueWarning._handler(ctx, { userId: 'u1' } as any);
    expect(ctx.db.patch).toHaveBeenCalledWith('u1', { warnings: 1 });
  });

  it('temporarily bans', async () => {
    const ctx = createAdminCtx() as any;
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    await tempBanUser._handler(ctx, { userId: 'u1', days: 2 } as any);
    expect(ctx.db.patch).toHaveBeenCalledWith('u1', { bannedUntil: 1000 + 2 * 86400000, role: 'banned' });
    (Date.now as jest.Mock).mockRestore();
  });

  it('permanently bans', async () => {
    const ctx = createAdminCtx() as any;
    await permBanUser._handler(ctx, { userId: 'u1' } as any);
    expect(ctx.db.patch).toHaveBeenCalledWith('u1', { bannedUntil: -1, role: 'banned' });
  });
});
