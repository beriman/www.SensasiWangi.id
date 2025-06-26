import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const getUserRewards = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    const points = user.contributionPoints ?? 0;
    const tier = points >= 500 ? "gold" : points >= 100 ? "silver" : "bronze";
    const discount = points >= 500 ? 0.1 : points >= 100 ? 0.05 : 0;
    const exclusiveAccess = points >= 100;
    return { tier, discount, exclusiveAccess };
  },
});

const weekStart = (ts: number) => {
  const d = new Date(ts);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.getTime();
};

export const getTopContributors = query({
  args: { limit: v.optional(v.number()), period: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    if (args.period === "weekly") {
      const entries = await ctx.db
        .query("weeklyLeaderboard")
        .withIndex("by_week", (q) => q.eq("weekStart", weekStart(Date.now())))
        .collect();
      entries.sort((a, b) => b.points - a.points);
      return entries.slice(0, limit).map((e) => ({
        _id: e.userId,
        name: e.name,
        image: e.image,
        contributionPoints: e.points,
      }));
    }
    const users = await ctx.db.query("users").collect();
    users.sort(
      (a, b) => (b.contributionPoints ?? 0) - (a.contributionPoints ?? 0),
    );
    return users.slice(0, limit).map((u) => ({
      _id: u._id,
      name: u.name,
      image: u.image,
      contributionPoints: u.contributionPoints ?? 0,
    }));
  },
});

export const updateWeeklyLeaderboard = internalMutation({
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    const start = weekStart(Date.now());
    allUsers.sort(
      (a, b) => (b.weeklyContributionPoints ?? 0) - (a.weeklyContributionPoints ?? 0),
    );
    const top = allUsers.slice(0, 50);
    for (const u of top) {
      await ctx.db.insert("weeklyLeaderboard", {
        weekStart: start,
        userId: u._id,
        name: u.name,
        image: u.image,
        points: u.weeklyContributionPoints ?? 0,
      });
    }
    for (const u of allUsers) {
      if ((u.weeklyContributionPoints ?? 0) !== 0) {
        await ctx.db.patch(u._id, { weeklyContributionPoints: 0 });
      }
    }
  },
});
