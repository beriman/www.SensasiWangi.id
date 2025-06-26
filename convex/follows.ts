import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const followUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");
    const follower = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!follower) throw new Error("User tidak ditemukan");
    if (follower._id === args.userId) throw new Error("Tidak bisa follow diri sendiri");
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) => q.eq("followerId", follower._id).eq("followingId", args.userId))
      .unique();
    if (existing) return false;
    await ctx.db.insert("follows", {
      followerId: follower._id,
      followingId: args.userId,
      createdAt: Date.now(),
    });
    return true;
  },
});

export const unfollowUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");
    const follower = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!follower) throw new Error("User tidak ditemukan");
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) => q.eq("followerId", follower._id).eq("followingId", args.userId))
      .unique();
    if (!existing) return false;
    await ctx.db.delete(existing._id);
    return true;
  },
});

export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();
    const users: any[] = [];
    for (const f of follows) {
      const u = await ctx.db.get(f.followerId);
      if (u) users.push(u);
    }
    return users;
  },
});

export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();
    const users: any[] = [];
    for (const f of follows) {
      const u = await ctx.db.get(f.followingId);
      if (u) users.push(u);
    }
    return users;
  },
});
