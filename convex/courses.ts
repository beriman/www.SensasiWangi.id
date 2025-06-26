import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all courses
export const listCourses = query(async ({ db }) => {
  return await db.query("courses").withIndex("by_created_at").order("desc").collect();
});

// Get a single course
export const getCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});

// Get single lesson
export const getLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

// Get lessons for a course ordered
export const getLessons = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_course_order", (q) => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();
  },
});

// Save lesson progress and completion
export const saveProgress = mutation({
  args: { lessonId: v.id("lessons"), progress: v.number(), completed: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Login required");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", user._id).eq("lessonId", args.lessonId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        progress: args.progress,
        completed: args.completed,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("progress", {
      userId: user._id,
      lessonId: args.lessonId,
      progress: args.progress,
      completed: args.completed,
      updatedAt: Date.now(),
    });
  },
});

export const getProgress = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) return null;
    return await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", user._id).eq("lessonId", args.lessonId))
      .unique();
  },
});

// Fetch quiz questions for a lesson
export const getQuizQuestions = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_lesson", (q) => q.eq("lessonId", args.lessonId))
      .order("asc")
      .collect();
  },
});

// Submit quiz answers and automatically grade
export const submitQuiz = mutation({
  args: { lessonId: v.id("lessons"), answers: v.array(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Login required");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const questions = await ctx.db
      .query("quizzes")
      .withIndex("by_lesson", (q) => q.eq("lessonId", args.lessonId))
      .order("asc")
      .collect();

    let correct = 0;
    questions.forEach((q, i) => {
      if (q.correctOption === args.answers[i]) correct++;
    });

    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;

    const existing = await ctx.db
      .query("quizResults")
      .withIndex("by_user_lesson", (q) => q.eq("userId", user._id).eq("lessonId", args.lessonId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        answers: args.answers,
        score,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.insert("quizResults", {
        lessonId: args.lessonId,
        userId: user._id,
        answers: args.answers,
        score,
        createdAt: Date.now(),
      });
    }

    return score;
  },
});

// Generate certificate after course completion
export const generateCertificate = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Login required");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completed = lessons.every((l) => progress.find((p) => p.lessonId === l._id && p.completed));

    if (!completed) throw new Error("Course not completed");

    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_user_course", (q) => q.eq("userId", user._id).eq("courseId", args.courseId))
      .unique();

    if (existing) return existing.url;

    const url = `/certificates/${user._id}_${args.courseId}.pdf`;
    await ctx.db.insert("certificates", {
      courseId: args.courseId,
      userId: user._id,
      url,
      createdAt: Date.now(),
    });
    return url;
  },
});

export const saveNote = mutation({
  args: { lessonId: v.id("lessons"), note: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Login required");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("lessonNotes")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        note: args.note,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("lessonNotes", {
      userId: user._id,
      lessonId: args.lessonId,
      note: args.note,
      updatedAt: Date.now(),
    });
  },
});

export const getNote = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) return null;
    return await ctx.db
      .query("lessonNotes")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .unique();
  },
});
