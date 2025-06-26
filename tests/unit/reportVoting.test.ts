import { voteReport, getTopReports } from '../../convex/forum';

describe('report voting', () => {
  it('requires auth to vote', async () => {
    const ctx = { auth: { getUserIdentity: jest.fn().mockResolvedValue(null) } } as any;
    await expect(
      voteReport._handler(ctx, { reportId: 'r1' as any, value: 1 })
    ).rejects.toThrow('Anda harus login');
  });

  it('returns reports sorted by votes', async () => {
    const reports = [
      { _id: 'r1', topicId: 't1', reporterId: 'u2', reason: 'spam', createdAt: 1 },
      { _id: 'r2', topicId: 't1', reporterId: 'u3', reason: 'off', createdAt: 2 },
    ];
    const votes = [
      { reportId: 'r1', userId: 'u3', value: 1 },
      { reportId: 'r1', userId: 'u4', value: 1 },
      { reportId: 'r2', userId: 'u3', value: 1 },
    ];
    const topics = [{ _id: 't1', title: 'Topic' }];
    const users = [
      { _id: 'u2', name: 'A' },
      { _id: 'u3', name: 'B' },
      { _id: 'u4', name: 'C' },
    ];
    const ctx = {
      db: {
        query: jest
          .fn()
          .mockReturnValueOnce({ collect: jest.fn().mockResolvedValue(reports) })
          .mockReturnValueOnce({ collect: jest.fn().mockResolvedValue(votes) })
          .mockReturnValueOnce({ collect: jest.fn().mockResolvedValue(topics) })
          .mockReturnValueOnce({ collect: jest.fn().mockResolvedValue(users) }),
      },
    } as any;

    const res = await getTopReports._handler(ctx, { limit: undefined } as any);
    expect(res[0].id).toBe('r1');
    expect(res[0].votes).toBe(2);
  });
});
