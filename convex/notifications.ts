import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import webPush from "web-push";

export const getNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const subscription = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    message: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      message: args.message,
      url: args.url,
      read: false,
      createdAt: now,
    });

    const subs = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    if (subs.length && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webPush.setVapidDetails(
        "mailto:no-reply@sensasiwangi.id",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY,
      );
      const payload = JSON.stringify({
        title: "SensasiWangi",
        body: args.message,
        url: args.url,
      });
      await Promise.all(
        subs.map((s) =>
          webPush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload).catch(() => {})
        )
      );
    }

    return id;
  },
});

export const saveSubscription = mutation({
  args: {
    userId: v.id("users"),
    subscription: v.object({
      endpoint: v.string(),
      keys: v.object({ p256dh: v.string(), auth: v.string() }),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        endpoint: args.subscription.endpoint,
        keys: args.subscription.keys,
      });
      return existing._id;
    }
    return await ctx.db.insert("pushSubscriptions", {
      userId: args.userId,
      endpoint: args.subscription.endpoint,
      keys: args.subscription.keys,
    });
  },
});

export const removeSubscription = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
