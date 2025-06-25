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
  args: {
    role: v.optional(v.string()),
    displayName: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
      const patchUser: any = {};
      if (args.displayName && existingUser.name !== args.displayName) {
        patchUser.name = args.displayName;
      } else if (existingUser.name !== identity.name) {
        patchUser.name = identity.name;
      }
      if (existingUser.email !== identity.email) {
        patchUser.email = identity.email;
      }
      if (args.role && existingUser.role !== args.role) {
        patchUser.role = args.role;
      }
      if (Object.keys(patchUser).length > 0) {
        await ctx.db.patch(existingUser._id, patchUser);
      }
      // Initialize fields if missing
      const patch: any = {};
      if (existingUser.contributionPoints === undefined) {
        patch.contributionPoints = 0;
      }
      if (existingUser.badges === undefined) {
        patch.badges = [];
      }
      if (existingUser.experiencePoints === undefined) {
        patch.experiencePoints = 0;
      }
      if (existingUser.level === undefined) {
        patch.level = 1;
      }
      if (existingUser.achievements === undefined) {
        patch.achievements = [];
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

      if (args.location || args.interests) {
        const existingProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", existingUser._id))
          .unique();
        const profilePatch: any = { lastActive: Date.now() };
        if (args.location) profilePatch.location = args.location;
        if (args.interests) profilePatch.interests = args.interests;
        if (existingProfile) {
          await ctx.db.patch(existingProfile._id, profilePatch);
        } else {
          await ctx.db.insert("userProfiles", {
            userId: existingUser._id,
            bio: undefined,
            location: args.location,
            interests: args.interests ?? [],
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
        }
      }
      return await ctx.db.get(existingUser._id);
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.displayName ?? identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      role: args.role ?? "buyer",
      contributionPoints: 0,
      badges: [],
      experiencePoints: 0,
      level: 1,
      achievements: [],
      createdAt: Date.now(),
      reviewCount: 0,
      helpfulCount: 0,
    });
    await ctx.db.insert("userProfiles", {
      userId,
      bio: undefined,
      location: args.location,
      interests: args.interests ?? [],
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

    return await ctx.db.get(userId);
  },
});

export const updateUserProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    website: v.optional(v.string()),
    avatar: v.optional(v.string()),
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
    interests: args.interests,
    phone: args.phone,
    whatsapp: args.whatsapp,
    instagram: args.instagram,
    twitter: args.twitter,
    website: args.website,
    avatar: args.avatar,
    lastActive: now,
  } as any;
    if (existing) {
      await ctx.db.patch(existing._id, profilePatch);
      return existing._id;
    }
    return await ctx.db.insert("userProfiles", {
      userId: user._id,
      ...profilePatch,
      avatar: args.avatar ?? null,
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

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .unique();

    return {
      ...user,
      profile: profile || null,
    };
  },
});
