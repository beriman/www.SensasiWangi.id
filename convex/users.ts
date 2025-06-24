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
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
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
      throw new Error("Tidak dapat mengautentikasi pengguna");
    }

    const now = Date.now();

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (existingUser) {
      // Update user information and ensure all fields are properly set
      const updateData: any = {};

      // Update basic info if changed
      if (existingUser.name !== identity.name) {
        updateData.name = identity.name;
      }
      if (existingUser.email !== identity.email) {
        updateData.email = identity.email;
      }

      // Initialize missing fields
      if (existingUser.contributionPoints === undefined) {
        updateData.contributionPoints = 0;
      }
      if (existingUser.badges === undefined) {
        updateData.badges = [];
      }
      if (existingUser.createdAt === undefined) {
        updateData.createdAt = now;
      }
      if (existingUser.reviewCount === undefined) {
        updateData.reviewCount = 0;
      }
      if (existingUser.helpfulCount === undefined) {
        updateData.helpfulCount = 0;
      }
      if (existingUser.role === undefined) {
        updateData.role = "buyer";
      }

      // Update if there are changes
      if (Object.keys(updateData).length > 0) {
        await ctx.db.patch(existingUser._id, updateData);
      }

      // Check and award membership badges
      const badges = new Set(existingUser.badges ?? []);
      const userCreatedAt = existingUser.createdAt ?? now;
      const daysSinceJoining = Math.floor((now - userCreatedAt) / 86400000);

      let badgesUpdated = false;
      if (daysSinceJoining >= 30 && !badges.has("Member Baru")) {
        badges.add("Member Baru");
        badgesUpdated = true;
      }
      if (daysSinceJoining >= 365 && !badges.has("Member Setia")) {
        badges.add("Member Setia");
        badgesUpdated = true;
      }

      if (badgesUpdated) {
        await ctx.db.patch(existingUser._id, { badges: Array.from(badges) });
      }

      return await ctx.db.get(existingUser._id);
    }

    // Create new user with all required fields
    const newUser = {
      name: identity.name ?? "Pengguna Baru",
      email: identity.email ?? "",
      tokenIdentifier: identity.subject,
      role: "buyer",
      contributionPoints: 0,
      badges: ["Pendatang Baru"],
      createdAt: now,
      reviewCount: 0,
      helpfulCount: 0,
    };

    const userId = await ctx.db.insert("users", newUser);

    // Create initial user profile
    await ctx.db.insert("userProfiles", {
      userId: userId,
      bio: undefined,
      location: undefined,
      phone: undefined,
      whatsapp: undefined,
      instagram: undefined,
      twitter: undefined,
      website: undefined,
      avatar: undefined,
      isVerified: false,
      rating: 0,
      totalReviews: 0,
      totalSales: 0,
      totalPurchases: 0,
      joinedAt: now,
      lastActive: now,
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
