import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const recordPointEvent = internalMutation({
  args: { userId: v.id("users"), activity: v.string(), points: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.insert("pointEvents", {
      userId: args.userId,
      activity: args.activity,
      points: args.points,
      createdAt: Date.now(),
    });

    const newPoints = (user.contributionPoints ?? 0) + args.points;
    const newWeekly = (user.weeklyContributionPoints ?? 0) + args.points;
    const exp = (user.experiencePoints ?? 0) + args.points;
    const level = Math.floor(exp / 100) + 1;

    await ctx.db.patch(args.userId, {
      contributionPoints: newPoints,
      weeklyContributionPoints: newWeekly,
      experiencePoints: exp,
      level,
    });
  },
});

export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return {
      level: user.level ?? 1,
      contributionPoints: user.contributionPoints ?? 0,
      badges: user.badges ?? [],
    };
  },
});

export const getUserPointEvents = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("pointEvents")
      .withIndex("by_user_time", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});
