import { mutation } from "./_generated/server";
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
