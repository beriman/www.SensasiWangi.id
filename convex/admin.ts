import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper function to check if the user is an admin
async function isAdmin(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
  if (user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

// Query to get all users (admin only)
export const getAllUsers = query({
  handler: async (ctx) => {
    await isAdmin(ctx);
    return await ctx.db.query("users").collect();
  },
});

// Mutation to update a user's role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    newRole: v.string(),
  },
  handler: async (ctx, { userId, newRole }) => {
    await isAdmin(ctx);
    await ctx.db.patch(userId, { role: newRole });
  },
});

// Mutation to toggle a user's active status (admin only)
export const toggleUserActiveStatus = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, { userId, isActive }) => {
    await isAdmin(ctx);
    await ctx.db.patch(userId, { active: isActive });
  },
});

// Query to get admin dashboard statistics (admin only)
export const getAdminDashboardStats = query({
  handler: async (ctx) => {
    await isAdmin(ctx);

    const totalUsers = await ctx.db.query("users").count();
    const totalProducts = await ctx.db.query("products").count();
    const totalCourses = await ctx.db.query("courses").count();
    const totalForumPostsToday = await ctx.db.query("topics")
      .filter(q => q.gte(q.field("createdAt"), Date.now() - 24 * 60 * 60 * 1000))
      .count();
    const totalSales = await ctx.db.query("orders")
      .filter(q => q.eq(q.field("paymentStatus"), "paid"))
      .collect()
      .then(orders => orders.reduce((sum, order) => sum + order.totalAmount, 0));

    return {
      totalUsers,
      totalProducts,
      totalCourses,
      totalForumPostsToday,
      totalSales,
    };
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