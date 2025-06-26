import { createTopic } from '../../convex/forum';

const baseArgs = {
  title: 'Test',
  content: 'Content',
  category: 'General',
  tags: [],
  hasVideo: false,
  hasImages: false,
};

describe('createTopic', () => {
  it('throws when unauthenticated', async () => {
    const ctx = { auth: { getUserIdentity: jest.fn().mockResolvedValue(null) } } as any;
    await expect(createTopic._handler(ctx, baseArgs as any)).rejects.toThrow('Anda harus login');
  });

  it('inserts topic for valid user', async () => {
    const user = { _id: 'u1', name: 'User', contributionPoints: 0, badges: [] };
    const ctx = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'token' }) },
      db: {
        query: jest.fn().mockReturnValue({
          withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }),
        }),
        insert: jest.fn().mockResolvedValue('t1'),
        patch: jest.fn(),
      },
      runMutation: jest.fn(),
      scheduler: { runAfter: jest.fn() },
    } as any;

    const id = await createTopic._handler(ctx, baseArgs as any);
    expect(id).toBe('t1');
    expect(ctx.db.insert).toHaveBeenCalledWith('topics', expect.any(Object));
    expect(ctx.runMutation).toHaveBeenCalled();
  });
});
