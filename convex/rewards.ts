import { v } from "convex/values";
import { query } from "./_generated/server";

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

export const getTopContributors = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    users.sort(
      (a, b) => (b.contributionPoints ?? 0) - (a.contributionPoints ?? 0),
    );
    const limit = args.limit ?? 50;
    return users.slice(0, limit).map((u) => ({
      _id: u._id,
      name: u.name,
      image: u.image,
      contributionPoints: u.contributionPoints ?? 0,
    }));
  },
});
