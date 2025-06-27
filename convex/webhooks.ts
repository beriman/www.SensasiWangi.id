import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logBriEvent = mutation({
  args: {
    eventType: v.string(),
    orderId: v.optional(v.id("orders")),
    rawBody: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("briWebhookEvents", {
      eventType: args.eventType,
      orderId: args.orderId,
      rawBody: args.rawBody,
      createdAt: Date.now(),
    });
  },
});

export const listBriWebhookEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("briWebhookEvents")
      .order("desc")
      .take(limit);
  },
});
