import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getBookmarksByUser = query({
  args: { userId: v.id("users"), type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    if (args.type) {
      bookmarks = bookmarks.filter((b) => b.itemType === args.type);
    }
    const results: { type: string; data: any }[] = [];
    for (const b of bookmarks) {
      if (b.itemType === "topic") {
        const topic = await ctx.db.get(b.itemId as Id<"topics">);
        if (topic) results.push({ type: "topic", data: topic });
      } else if (b.itemType === "product") {
        const product = await ctx.db.get(b.itemId as Id<"products">);
        if (product) results.push({ type: "product", data: product });
      }
    }
    return results;
  },
});

export const toggleBookmark = mutation({
  args: { itemId: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_item", (q) => q.eq("userId", user._id).eq("itemId", args.itemId))
      .collect();
    const bookmark = existing.find((b) => b.itemType === args.type);

    if (bookmark) {
      await ctx.db.delete(bookmark._id);
      return false;
    } else {
      await ctx.db.insert("bookmarks", {
        userId: user._id,
        itemId: args.itemId,
        itemType: args.type,
        createdAt: Date.now(),
      });
      return true;
    }
  },
});
