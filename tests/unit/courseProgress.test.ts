import { getCourseProgress } from '../../convex/progress';

describe('course progress', () => {
  it('returns progress records for course lessons', async () => {
    const user = { _id: 'u1' };
    const lessons = [{ _id: 'l1' }, { _id: 'l2' }];
    const progressData = [
      { lessonId: 'l1', userId: 'u1', progress: 100, completed: true },
      { lessonId: 'l2', userId: 'u1', progress: 50, completed: false },
    ];

    const ctx = {
      auth: { getUserIdentity: jest.fn().mockResolvedValue({ subject: 't' }) },
      db: {
        query: jest
          .fn()
          .mockReturnValueOnce({
            withIndex: () => ({ unique: jest.fn().mockResolvedValue(user) }),
          })
          .mockReturnValueOnce({
            withIndex: () => ({ collect: jest.fn().mockResolvedValue(lessons) }),
          })
          .mockReturnValue({
            withIndex: () => ({ collect: jest.fn().mockResolvedValue(progressData) }),
          }),
      },
    } as any;

    const result = await getCourseProgress._handler(ctx, { courseId: 'c1' } as any);
    expect(result).toEqual(progressData);
  });
});
