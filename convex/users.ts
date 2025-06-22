import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    // Get the user's identity from the auth context
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.subject)
      )
      .unique();

    if (user !== null) {
      return user;
    }

    return null;
  },
});

export const createOrUpdateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.subject)
      )
      .unique();

    if (existingUser) {
      // Update if needed
      if (existingUser.name !== identity.name || existingUser.email !== identity.email) {
        await ctx.db.patch(existingUser._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      // Initialize points/badges if missing
      if (existingUser.contributionPoints === undefined || existingUser.badges === undefined) {
        await ctx.db.patch(existingUser._id, {
          contributionPoints: existingUser.contributionPoints ?? 0,
          badges: existingUser.badges ?? [],
        });
      }
      return existingUser;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      contributionPoints: 0,
      badges: [],
    });

    return await ctx.db.get(userId);
  },
});

export const getPrivacySettings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) {
      return {
        profileVisibility: "public",
        activityVisibility: "public",
        commentsVisibility: "public",
      };
    }

    return {
      profileVisibility: profile.profileVisibility ?? "public",
      activityVisibility: profile.activityVisibility ?? "public",
      commentsVisibility: profile.commentsVisibility ?? "public",
    };
  },
});

export const updatePrivacySettings = mutation({
  args: {
    userId: v.id("users"),
    profileVisibility: v.string(),
    activityVisibility: v.string(),
    commentsVisibility: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        profileVisibility: args.profileVisibility,
        activityVisibility: args.activityVisibility,
        commentsVisibility: args.commentsVisibility,
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        bio: undefined,
        location: undefined,
        phone: undefined,
        whatsapp: undefined,
        instagram: undefined,
        avatar: undefined,
        isVerified: false,
        rating: 0,
        totalReviews: 0,
        totalSales: 0,
        totalPurchases: 0,
        joinedAt: Date.now(),
        lastActive: Date.now(),
        profileVisibility: args.profileVisibility,
        activityVisibility: args.activityVisibility,
        commentsVisibility: args.commentsVisibility,
      });
    }
  },
});