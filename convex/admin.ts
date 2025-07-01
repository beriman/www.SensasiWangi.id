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

// Query to get all products for admin (admin only)
export const getAllProductsAdmin = query({
  handler: async (ctx) => {
    await isAdmin(ctx);
    return await ctx.db.query("products").collect();
  },
});

// Query to get all orders for admin (admin only)
export const getAllOrdersAdmin = query({
  handler: async (ctx) => {
    await isAdmin(ctx);
    return await ctx.db.query("orders").collect();
  },
});

// Mutation to update a product (admin only)
export const updateProductAdmin = mutation({
  args: {
    productId: v.id("products"),
    updatedFields: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      price: v.optional(v.number()),
      stock: v.optional(v.number()),
      category: v.optional(v.string()),
      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { productId, updatedFields }) => {
    await isAdmin(ctx);
    await ctx.db.patch(productId, updatedFields);
  },
});

// Mutation to delete a product (admin only)
export const deleteProductAdmin = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, { productId }) => {
    await isAdmin(ctx);
    await ctx.db.delete(productId);
  },
});

// Mutation to create a new category (admin only)
export const createCategoryAdmin = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    type: v.string(),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await isAdmin(ctx);
    return await ctx.db.insert("categories", {
      ...args,
      count: 0, // New categories start with 0 count
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Mutation to update an existing category (admin only)
export const updateCategoryAdmin = mutation({
  args: {
    categoryId: v.id("categories"),
    updatedFields: v.object({
      name: v.optional(v.string()),
      icon: v.optional(v.string()),
      type: v.optional(v.string()),
      order: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { categoryId, updatedFields }) => {
    await isAdmin(ctx);
    await ctx.db.patch(categoryId, { ...updatedFields, updatedAt: Date.now() });
  },
});

// Mutation to delete a category (admin only)
export const deleteCategoryAdmin = mutation({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, { categoryId }) => {
    await isAdmin(ctx);
    await ctx.db.delete(categoryId);
  },
});