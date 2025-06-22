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
      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", existingUser._id))
        .unique();
      if (!existingProfile) {
        await ctx.db.insert("userProfiles", {
          userId: existingUser._id,
          bio: undefined,
          location: undefined,
          phone: undefined,
          whatsapp: undefined,
          instagram: undefined,
          avatar: undefined,
          points: 0,
          badges: [],
          isVerified: false,
          rating: 0,
          totalReviews: 0,
          totalSales: 0,
          totalPurchases: 0,
          joinedAt: Date.now(),
          lastActive: Date.now(),
        });
      }
      return existingUser;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
    });

    await ctx.db.insert("userProfiles", {
      userId,
      bio: undefined,
      location: undefined,
      phone: undefined,
      whatsapp: undefined,
      instagram: undefined,
      avatar: undefined,
      points: 0,
      badges: [],
      isVerified: false,
      rating: 0,
      totalReviews: 0,
      totalSales: 0,
      totalPurchases: 0,
      joinedAt: Date.now(),
      lastActive: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

export const addUserPoints = mutation({
  args: { userId: v.id("users"), points: v.number() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile) return;
    const newPoints = profile.points + args.points;
    let badges = profile.badges || [];
    if (newPoints >= 100 && !badges.includes("Contributor")) {
      badges = [...badges, "Contributor"];
    }
    if (newPoints >= 500 && !badges.includes("Pro Contributor")) {
      badges = [...badges, "Pro Contributor"];
    }
    if (newPoints >= 1000 && !badges.includes("Master Contributor")) {
      badges = [...badges, "Master Contributor"];
    }
    await ctx.db.patch(profile._id, {
      points: newPoints,
      badges,
      lastActive: Date.now(),
    });
  },
});