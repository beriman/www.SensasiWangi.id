import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

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
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        progress: args.progress,
        completed: args.completed,
        updatedAt: Date.now(),
      });
      if (args.completed && !existing.completed) {
        await ctx.runMutation(internal.points.recordPointEvent, {
          userId: user._id,
          activity: "complete_lesson",
          points: 5,
        });
      }
      return existing._id;
    }

    const id = await ctx.db.insert("progress", {
      userId: user._id,
      lessonId: args.lessonId,
      progress: args.progress,
      completed: args.completed,
      updatedAt: Date.now(),
    });

    if (args.completed) {
      await ctx.runMutation(internal.points.recordPointEvent, {
        userId: user._id,
        activity: "complete_lesson",
        points: 5,
      });
    }

    return id;
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
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .unique();
  },
});

export const getCourseProgress = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) return [];
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
    if (lessons.length === 0) return [];
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return progress.filter((p) =>
      lessons.find((l) => l._id === p.lessonId)
    );
  },
});
