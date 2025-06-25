import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCertificate = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) return null;
    return await ctx.db
      .query("certificates")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", args.courseId)
      )
      .unique();
  },
});

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

    const completed = lessons.every((l) =>
      progress.find((p) => p.lessonId === l._id && p.completed)
    );

    if (!completed) throw new Error("Course not completed");

    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", args.courseId)
      )
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
