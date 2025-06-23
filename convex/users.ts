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
      // Initialize fields if missing
      const patch: any = {};
      if (existingUser.contributionPoints === undefined) {
        patch.contributionPoints = 0;
      }
      if (existingUser.badges === undefined) {
        patch.badges = [];
      }
      if (existingUser.createdAt === undefined) {
        patch.createdAt = Date.now();
      }
      if (existingUser.reviewCount === undefined) {
        patch.reviewCount = 0;
      }
      if (existingUser.helpfulCount === undefined) {
        patch.helpfulCount = 0;
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(existingUser._id, patch);
      }

      // Check membership achievement
      const badges = new Set(existingUser.badges ?? []);
      const days = Math.floor((Date.now() - (existingUser.createdAt ?? Date.now())) / 86400000);
      if (days >= 365) {
        badges.add("Member setia");
      }
      await ctx.db.patch(existingUser._id, { badges: Array.from(badges) });
      return await ctx.db.get(existingUser._id);
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      role: "buyer",
      contributionPoints: 0,
      badges: [],
      createdAt: Date.now(),
      reviewCount: 0,
      helpfulCount: 0,
    });

    return await ctx.db.get(userId);
  },
});

export const updateUserProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    const now = Date.now();
    const profilePatch = {
      bio: args.bio,
      location: args.location,
      phone: args.phone,
      whatsapp: args.whatsapp,
      instagram: args.instagram,
      twitter: args.twitter,
      website: args.website,
      lastActive: now,
    } as any;
    if (existing) {
      await ctx.db.patch(existing._id, profilePatch);
      return existing._id;
    }
    return await ctx.db.insert("userProfiles", {
      userId: user._id,
      ...profilePatch,
      avatar: null,
      isVerified: false,
      rating: 0,
      totalReviews: 0,
      totalSales: 0,
      totalPurchases: 0,
      joinedAt: now,
    });
  },
});

export const updateUserRole = mutation({
  args: { userId: v.id("users"), role: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!currentUser) {
      throw new Error("User not found");
    }
    // Only admins can update roles
    if (currentUser.role !== "admin") {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.userId, { role: args.role });
    return true;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

