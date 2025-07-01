import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Contoh fungsi untuk mendapatkan semua pengguna
export const getAllUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Cek peran dari database
    const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return await ctx.db.query("users").collect();
  },
});

export const issueWarning = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    await ctx.db.patch(args.userId, { warnings: (user.warnings || 0) + 1 });
  },
});

export const tempBanUser = mutation({
  args: { userId: v.id("users"), days: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.userId, {
      bannedUntil: Date.now() + args.days * 86400000,
      role: "banned",
    });
  },
});

export const permBanUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.userId, { bannedUntil: -1, role: "banned" });
  },
});