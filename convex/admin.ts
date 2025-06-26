import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import os from "node:os";

export const getSystemHealth = query({
  handler: async () => {
    const uptimeSeconds = process.uptime();
    const totalMem = os.totalmem();
    const usedMem = totalMem - os.freemem();
    const memoryUsage = `${((usedMem / totalMem) * 100).toFixed(1)}%`;

    return {
      uptime: `${Math.floor(uptimeSeconds / 60)}m`,
      memoryUsage,
      diskUsage: "N/A",
      activeConnections: 0,
    };
  },
});

export const suspendUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.userId, {
      role: "suspended",
    });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.userId);
  },
});

export const broadcastSystemMessage = mutation({
  args: { message: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const allUsers = await ctx.db.query("users").collect();
    const now = Date.now();
    await Promise.all(
      allUsers.map((u) =>
        ctx.db.insert("notifications", {
          userId: u._id,
          type: "system",
          message: args.message,
          read: false,
          createdAt: now,
        }),
      ),
    );
  },
});

export const clearSystemCache = mutation({
  args: { type: v.string() },
  handler: async () => {
    // Placeholder - in a real app this would clear CDN or application caches
    return true;
  },
});

export const backupDatabase = mutation({
  handler: async (ctx) => {
    const tables = [
      "users",
      "userProfiles",
      "products",
      "orders",
      "topics",
      "comments",
      "topicReports",
    ];
    const backup: Record<string, any[]> = {};
    for (const table of tables) {
      backup[table] = await ctx.db.query(table as any).collect();
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const storageId = await (ctx.storage as any).store(blob);
    return storageId;
  },
});

export const getPendingReports = query({
  handler: async (ctx) => {
    const reports = await ctx.db.query("topicReports").collect();
    const topics = await ctx.db.query("topics").collect();
    const users = await ctx.db.query("users").collect();
    const topicMap = new Map(topics.map((t) => [t._id, t.title]));
    const userMap = new Map(users.map((u) => [u._id, u.name]));
    return reports.map((r) => ({
      id: r._id,
      type: "Topic",
      content: `${topicMap.get(r.topicId) ?? ""} - ${r.reason}`,
      reporter: userMap.get(r.reporterId) ?? "Unknown",
      status: "pending",
    }));
  },
});

export const getPlatformAnalytics = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const topics = await ctx.db.query("topics").collect();
    const comments = await ctx.db.query("comments").collect();
    const orders = await ctx.db.query("orders").collect();
    const pendingReports = await ctx.db.query("topicReports").collect();

    return {
      userCount: users.length,
      topicCount: topics.length,
      commentCount: comments.length,
      orderCount: orders.length,
      pendingReports: pendingReports.length,
    };
  },
});

export const getPendingPayments = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders.filter((o) => o.paymentStatus !== "paid");
  },
});
