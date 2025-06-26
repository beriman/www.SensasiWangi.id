import { createTopic } from '../../convex/forum';
import { saveProgress } from '../../convex/progress';
import { createProduct } from '../../convex/marketplace';
import { internal } from '../../convex/_generated/api';

const baseTopicArgs = {
  title: 'Test',
  content: 'Content',
  category: 'General',
  tags: [],
  hasVideo: false,
  hasImages: false,
};

const progressArgs = { lessonId: 'l1' as any, progress: 100, completed: true };

const productArgs = {
  title: 'New',
  description: 'desc',
  price: 10,
  originalPrice: undefined,
  category: 'cat',
  condition: 'new',
  brand: 'b',
  size: 's',
  images: [],
  location: 'loc',
  shippingOptions: [],
  tags: [],
  isNegotiable: false,
  stock: 1,
};

describe('points accumulation', () => {
  it('logs points on forum post', async () => {
    const user = { _id: 'u1', name: 'User', contributionPoints: 0, weeklyContributionPoints:0, badges: [] };
    const ctx = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 't' }) },
      db: {
        query: jest.fn()
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }) })
          .mockReturnValue({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(null) }) }),
        insert: jest.fn().mockResolvedValue('t1'),
        patch: jest.fn(),
      },
      runMutation: jest.fn(),
      scheduler: { runAfter: jest.fn() },
    } as any;

    await createTopic._handler(ctx, baseTopicArgs as any);
    expect(ctx.runMutation).toHaveBeenCalledWith(
      internal.points.recordPointEvent,
      { userId: 'u1', activity: 'create_topic', points: 10 }
    );
  });

  it('logs points on lesson completion', async () => {
    const user = { _id: 'u1', contributionPoints: 0, weeklyContributionPoints:0 };
    const ctx = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 't' }) },
      db: {
        query: jest
          .fn()
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }) })
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(null) }) })
          .mockReturnValue({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(null) }) }),
        insert: jest.fn().mockResolvedValue('p1'),
        patch: jest.fn(),
      },
      runMutation: jest.fn(),
    } as any;

    await saveProgress._handler(ctx, progressArgs as any);
    expect(ctx.runMutation).toHaveBeenCalledWith(
      internal.points.recordPointEvent,
      { userId: 'u1', activity: 'complete_lesson', points: 5 }
    );
  });

  it('logs points on product creation', async () => {
    const user = { _id: 'u1', name:'U', role:'seller', contributionPoints:0, weeklyContributionPoints:0 };
    const ctx = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 't' }) },
      db: {
        query: jest.fn()
          .mockReturnValueOnce({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }) })
          .mockReturnValue({ withIndex: () => ({ unique: jest.fn().mockResolvedValue(null), collect: jest.fn().mockResolvedValue([]) }) }),
        insert: jest.fn().mockResolvedValue('prod1'),
        patch: jest.fn(),
      },
      runMutation: jest.fn(),
    } as any;

    await createProduct._handler(ctx, productArgs as any);
    expect(ctx.runMutation).toHaveBeenCalledWith(
      internal.points.recordPointEvent,
      { userId: 'u1', activity: 'create_product', points: 10 }
    );
  });
});
