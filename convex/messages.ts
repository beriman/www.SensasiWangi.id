import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: { recipientId: v.id("users"), content: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Login required");
    const sender = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!sender) throw new Error("User not found");

    const now = Date.now();
    return await ctx.db.insert("messages", {
      senderId: sender._id,
      recipientId: args.recipientId,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listMessages = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!currentUser) return [];

    const sent = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", currentUser._id).eq("recipientId", args.otherUserId)
      )
      .collect();

    const received = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.otherUserId).eq("recipientId", currentUser._id)
      )
      .collect();

    const all = sent.concat(received);
    all.sort((a, b) => a.createdAt - b.createdAt);
    return all;
  },
});
