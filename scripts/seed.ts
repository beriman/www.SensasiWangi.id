import { mutation } from "../convex/_generated/server";
import { v } from "convex/values";

export const seedAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (existingUser) {
      console.log("Admin user already exists:", existingUser.email);
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: args.tokenIdentifier,
      role: "admin", // Set role to admin
      contributionPoints: 0,
      weeklyContributionPoints: 0,
      badges: [],
      experiencePoints: 0,
      level: 1,
      achievements: [],
      createdAt: Date.now(),
      reviewCount: 0,
      helpfulCount: 0,
      warnings: 0,
      bannedUntil: 0,
    });

    await ctx.db.insert("userProfiles", {
      userId,
      bio: undefined,
      location: undefined,
      interests: [],
      phone: undefined,
      whatsapp: undefined,
      instagram: undefined,
      twitter: undefined,
      website: undefined,
      avatar: null,
      isVerified: false,
      rating: 0,
      totalReviews: 0,
      totalSales: 0,
      totalPurchases: 0,
      joinedAt: Date.now(),
      lastActive: Date.now(),
    });

    await ctx.db.insert("userSettings", {
      userId,
      notificationPreferences: {
        badge: true,
        like: true,
        comment: true,
        product: true,
        order: true,
      },
    });

    console.log("Admin user created with ID:", userId);
    return userId;
  },
});