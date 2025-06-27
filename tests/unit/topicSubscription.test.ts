import { subscribeTopic, unsubscribeTopic, sendReplyNotifications } from '../../convex/forum';
import * as emailUtil from '../../src/utils/email';

describe('topic subscriptions', () => {
  it('subscribes and unsubscribes user', async () => {
    const user = { _id: 'u1' };
    const sub = { _id: 's1', topicId: 't1', userId: 'u1', createdAt: 0 } as any;
    const ctxSub: any = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'tok' }) },
      db: {
        query: jest.fn()
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }) })
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(null) }) }),
        insert: jest.fn(),
      },
    };
    const res = await subscribeTopic._handler(ctxSub, { topicId: 't1' } as any);
    expect(res).toBe(true);
    expect(ctxSub.db.insert).toHaveBeenCalled();

    const ctxUnsub: any = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 'tok' }) },
      db: {
        query: jest.fn()
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }) })
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(sub) }) }),
        delete: jest.fn(),
      },
    };
    const res2 = await unsubscribeTopic._handler(ctxUnsub, { topicId: 't1' } as any);
    expect(res2).toBe(true);
    expect(ctxUnsub.db.delete).toHaveBeenCalledWith(sub._id);
  });

  it('sends emails to subscribers', async () => {
    jest.spyOn(emailUtil, 'sendEmail').mockResolvedValueOnce(undefined as any);
    const comment = { _id: 'c1', topicId: 't1', content: 'x', authorId: 'u1', authorName: 'A' } as any;
    const topic = { _id: 't1', title: 'Topic' } as any;
    const subs = [
      { _id: 's1', topicId: 't1', userId: 'u2' },
      { _id: 's2', topicId: 't1', userId: 'u1' },
    ];
    const user2 = { _id: 'u2', email: 'b@test.com' } as any;
    const ctx: any = {
      db: {
        get: jest.fn().mockImplementation((id: string) => {
          if (id === 'c1') return comment;
          if (id === 't1') return topic;
          if (id === 'u2') return user2;
          return null;
        }),
        query: jest.fn().mockReturnValue({ withIndex: () => ({ collect: jest.fn().mockResolvedValue(subs) }) }),
      },
    };
    await sendReplyNotifications._handler(ctx, { commentId: 'c1' } as any);
    expect(emailUtil.sendEmail).toHaveBeenCalledTimes(1);
    expect((emailUtil.sendEmail as jest.Mock).mock.calls[0][0].to).toBe('b@test.com');
  });
});
