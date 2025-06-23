import { v } from "convex/values";
import { query } from "./_generated/server";

export const crossSearch = query({
  args: { term: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { term, limit }) => {
    const lower = term.toLowerCase();
    const max = limit ?? 5;

    const topics = await ctx.db
      .query("topics")
      .withSearchIndex("search_title", (q) => q.search("title", term))
      .take(max);

    const products = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const filteredProducts = products.filter((p) =>
      p.title.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
    ).slice(0, max);

    return { topics, products: filteredProducts };
  },
});
