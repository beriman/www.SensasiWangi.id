import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    // Get the user's identity from the auth context
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.subject)
      )
      .unique();

    if (user !== null) {
      return user;
    }

    return null;
  },
});

export const createOrUpdateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.subject)
      )
      .unique();

  if (existingUser) {
    const patch: any = {};
    if (existingUser.name !== identity.name) patch.name = identity.name;
    if (existingUser.email !== identity.email) patch.email = identity.email;
    if (existingUser.points === undefined) patch.points = 0;
    if (existingUser.badges === undefined) patch.badges = [];
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(existingUser._id, patch);
      return { ...existingUser, ...patch };
    }
    return existingUser;
  }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      points: 0,
      badges: [],
    });

    return await ctx.db.get(userId);
  },
});