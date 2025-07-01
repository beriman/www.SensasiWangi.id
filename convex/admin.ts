import { query } from "./_generated/server";

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