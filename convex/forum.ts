import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Threshold untuk menandai topik sebagai "hot"
const HOT_LIKES_THRESHOLD = 10;
const HOT_VIEWS_THRESHOLD = 100;

// Query untuk mendapatkan semua topik dengan pagination
export const getTopics = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
      id: v.optional(v.number()),
    }),
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db.query("topics");

    if (args.searchQuery) {
      query = query.withSearchIndex("search_title", (q) => {
        let search = q.search("title", args.searchQuery!);
        if (args.category) search = search.eq("category", args.category);
        return search;
      });
    } else {
      // Filter berdasarkan kategori
      if (args.category) {
        query = query.withIndex("by_category", (q) =>
          q.eq("category", args.category),
        );
      }

      // Sorting hanya jika tidak melakukan search
      if (args.sortBy === "popular") {
        query = query.withIndex("by_likes").order("desc");
      } else if (args.sortBy === "views") {
        query = query.withIndex("by_views").order("desc");
      } else {
        query = query.withIndex("by_created_at").order("desc");
      }
    }

    // Remove the id field from paginationOpts before passing to paginate
    const { id, ...paginationOpts } = args.paginationOpts;
    const topics = await query.paginate(paginationOpts);

    let filteredPage = topics.page;



    // Filter berdasarkan tag jika ada
    if (args.tag) {
      filteredPage = filteredPage.filter((topic) =>
        topic.tags.includes(args.tag!),
      );
    }

    return {
      ...topics,
      page: filteredPage,
    };
  },
});

// Mutation untuk pin/unpin topik
export const togglePinTopic = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topik tidak ditemukan");
    }

    if (topic.authorId !== user._id) {
      throw new Error("Bukan pemilik topik");
    }

    await ctx.db.patch(args.topicId, {
      isPinned: !topic.isPinned,
      updatedAt: Date.now(),
    });

    return !topic.isPinned;
  },
});

// Query untuk mendapatkan semua topik yang dipin
export const getPinnedTopics = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const q = args.category
      ? ctx
          .db
          .query("topics")
          .withIndex("by_category", (qq) => qq.eq("category", args.category))
      : ctx.db.query("topics").withIndex("by_created_at");

    return await q
      .filter((qq) => qq.eq(qq.field("isPinned"), true))
      .order("desc")
      .collect();
  },
});

// Query untuk mendapatkan topik berdasarkan ID
export const getTopicById = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.topicId);
  },
});

// Query untuk mendapatkan komentar berdasarkan topik
export const getCommentsByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .order("asc")
      .collect();
  },
});

// Query untuk cek apakah user sudah like topik
export const hasUserLikedTopic = query({
  args: { topicId: v.id("topics"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("topicLikes")
      .withIndex("by_topic_user", (q) =>
        q.eq("topicId", args.topicId).eq("userId", args.userId),
      )
      .unique();
    return !!like;
  },
});

// Query untuk mendapatkan topik berdasarkan author
export const getTopicsByAuthor = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();

    return topics;
  },
});

// Query untuk mendapatkan komentar berdasarkan author
export const getCommentsByAuthor = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();

    return comments;
  },
});

// Query untuk mendapatkan komentar terbaru beserta info topik
export const getRecentCommentsWithTopic = query({
  args: { authorId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();

    const recent = comments.slice(0, limit);

    const withTopic = await Promise.all(
      recent.map(async (comment) => {
        const topic = await ctx.db.get(comment.topicId);
        return {
          ...comment,
          topicTitle: topic?.title,
          topicLikes: topic?.likes ?? 0,
          topicViews: topic?.views ?? 0,
        };
      }),
    );

    return withTopic;
  },
});

// Mutation untuk membuat topik baru
export const createTopic = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    hasVideo: v.boolean(),
    hasImages: v.boolean(),
    videoUrls: v.optional(v.array(v.string())),
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk membuat topik");
    }

    // Cari user berdasarkan token
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const now = Date.now();

    const topicId = await ctx.db.insert("topics", {
      title: args.title,
      content: args.content,
      category: args.category,
      authorId: user._id,
      authorName: user.name || "Anonymous",
      views: 0,
      likes: 0,
      score: 0,
      isHot: false,
      isPinned: false,
      hasVideo: args.hasVideo,
      hasImages: args.hasImages,
      tags: args.tags,
      videoUrls: args.videoUrls,
      imageUrls: args.imageUrls,
      createdAt: now,
      updatedAt: now,
    });

    // Tambah poin kontribusi pada user
    const newPoints = (user.contributionPoints ?? 0) + 10;
    const newBadges = user.badges ? [...user.badges] : [];
    if (newPoints >= 100 && !newBadges.includes("Kontributor Aktif")) {
      newBadges.push("Kontributor Aktif");
    }
    if (newPoints >= 500 && !newBadges.includes("Master Diskusi")) {
      newBadges.push("Master Diskusi");
    }
    await ctx.db.patch(user._id, {
      contributionPoints: newPoints,
      badges: newBadges,
    });

    // Update category count setelah topic dibuat
    await ctx.scheduler.runAfter(
      0,
      "forum:updateCategoryCount" as any,
      {
        categoryName: args.category,
      },
    );

    return topicId;
  },
});

// Mutation untuk like/unlike topik
export const toggleTopicLike = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk like topik");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Cek apakah sudah like
    const existingLike = await ctx.db
      .query("topicLikes")
      .withIndex("by_topic_user", (q) =>
        q.eq("topicId", args.topicId).eq("userId", user._id),
      )
      .unique();

    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topik tidak ditemukan");
    }

    let newLikes = topic.likes;
    if (existingLike) {
      // Unlike - hapus like dan kurangi counter
      await ctx.db.delete(existingLike._id);
      newLikes = Math.max(0, topic.likes - 1);
    } else {
      // Like - tambah like dan tambah counter
      await ctx.db.insert("topicLikes", {
        topicId: args.topicId,
        userId: user._id,
        createdAt: Date.now(),
      });
      newLikes = topic.likes + 1;
    }

    await ctx.db.patch(args.topicId, {
      likes: newLikes,
      isHot:
        newLikes >= HOT_LIKES_THRESHOLD ||
        topic.views >= HOT_VIEWS_THRESHOLD ||
        topic.isHot,
      updatedAt: Date.now(),
    });

    return !existingLike;
  },
});

// Mutation untuk upvote/downvote topik
export const toggleTopicVote = mutation({
  args: { topicId: v.id("topics"), value: v.union(v.literal(1), v.literal(-1)) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk vote");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topik tidak ditemukan");
    }

    const existing = await ctx.db
      .query("topicVotes")
      .withIndex("by_topic_user", (q) =>
        q.eq("topicId", args.topicId).eq("userId", user._id),
      )
      .unique();

    let newScore = topic.score;
    if (!existing) {
      await ctx.db.insert("topicVotes", {
        topicId: args.topicId,
        userId: user._id,
        value: args.value,
        createdAt: Date.now(),
      });
      newScore += args.value;
    } else if (existing.value === args.value) {
      await ctx.db.delete(existing._id);
      newScore -= existing.value;
    } else {
      await ctx.db.patch(existing._id, { value: args.value });
      newScore = newScore - existing.value + args.value;
    }

    await ctx.db.patch(args.topicId, { score: newScore, updatedAt: Date.now() });

    return newScore;
  },
});

// Mutation untuk increment view count
export const incrementTopicViews = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topik tidak ditemukan");
    }

    const newViews = topic.views + 1;
    await ctx.db.patch(args.topicId, {
      views: newViews,
      isHot:
        newViews >= HOT_VIEWS_THRESHOLD ||
        topic.likes >= HOT_LIKES_THRESHOLD ||
        topic.isHot,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk membuat komentar
export const createComment = mutation({
  args: {
    topicId: v.id("topics"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk berkomentar");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const now = Date.now();

    const commentId = await ctx.db.insert("comments", {
      topicId: args.topicId,
      content: args.content,
      authorId: user._id,
      authorName: user.name || "Anonymous",
      likes: 0,
      score: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Tambah poin kontribusi pada user
    const newPoints = (user.contributionPoints ?? 0) + 2;
    const newBadges = user.badges ? [...user.badges] : [];
    if (newPoints >= 100 && !newBadges.includes("Kontributor Aktif")) {
      newBadges.push("Kontributor Aktif");
    }
    if (newPoints >= 500 && !newBadges.includes("Master Diskusi")) {
      newBadges.push("Master Diskusi");
    }
    await ctx.db.patch(user._id, {
      contributionPoints: newPoints,
      badges: newBadges,
    });

    const topic = await ctx.db.get(args.topicId);
    if (topic && topic.authorId !== user._id) {
      await ctx.db.insert("notifications", {
        userId: topic.authorId,
        type: "comment",
        message: `${user.name || "Anonymous"} mengomentari topik Anda \"${topic.title}\"`,
        url: `/forum?topic=${topic._id}`,
        read: false,
        createdAt: now,
      });
    }

    return commentId;
  },
});

// Mutation untuk upvote/downvote komentar
export const toggleCommentVote = mutation({
  args: { commentId: v.id("comments"), value: v.union(v.literal(1), v.literal(-1)) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login untuk vote");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Komentar tidak ditemukan");

    const existing = await ctx.db
      .query("commentVotes")
      .withIndex("by_comment_user", (q) =>
        q.eq("commentId", args.commentId).eq("userId", user._id),
      )
      .unique();

    let newScore = comment.score;
    if (!existing) {
      await ctx.db.insert("commentVotes", {
        commentId: args.commentId,
        userId: user._id,
        value: args.value,
        createdAt: Date.now(),
      });
      newScore += args.value;
    } else if (existing.value === args.value) {
      await ctx.db.delete(existing._id);
      newScore -= existing.value;
    } else {
      await ctx.db.patch(existing._id, { value: args.value });
      newScore = newScore - existing.value + args.value;
    }

    await ctx.db.patch(args.commentId, { score: newScore, updatedAt: Date.now() });
    return newScore;
  },
});

// Query untuk mendapatkan statistik forum
export const getForumStats = query({
  handler: async (ctx) => {
    const totalTopics = await ctx.db.query("topics").collect();
    const totalComments = await ctx.db.query("comments").collect();
    const totalUsers = await ctx.db.query("users").collect();

    // Hitung active users (yang posting dalam 24 jam terakhir)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentTopics = totalTopics.filter(
      (topic) => topic.createdAt > oneDayAgo,
    );
    const recentComments = totalComments.filter(
      (comment) => comment.createdAt > oneDayAgo,
    );

    const activeUserIds = new Set([
      ...recentTopics.map((t) => t.authorId),
      ...recentComments.map((c) => c.authorId),
    ]);

    return {
      totalMembers: totalUsers.length,
      activeToday: activeUserIds.size,
      totalPosts: totalTopics.length + totalComments.length,
    };
  },
});

// Query untuk mendapatkan semua categories dengan count real-time
export const getCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();

    // Hitung jumlah topik untuk setiap kategori secara real-time
    const categoriesWithRealCount = await Promise.all(
      categories.map(async (category) => {
        const topicsCount = await ctx.db
          .query("topics")
          .withIndex("by_category", (q) => q.eq("category", category.name))
          .collect();

        return {
          ...category,
          count: topicsCount.length,
        };
      }),
    );

    return categoriesWithRealCount;
  },
});

// Query untuk mendapatkan semua tag unik
export const getAllTags = query({
  handler: async (ctx) => {
    const topics = await ctx.db.query("topics").collect();
    const tagSet = new Set<string>();
    for (const topic of topics) {
      for (const tag of topic.tags) {
        const trimmed = tag.trim();
        if (trimmed) tagSet.add(trimmed);
      }
    }
    return Array.from(tagSet);
  },
});

// Mutation untuk menginisialisasi categories default
export const initializeCategories = mutation({
  handler: async (ctx) => {
    // Cek apakah sudah ada categories
    const existingCategories = await ctx.db.query("categories").collect();
    if (existingCategories.length > 0) {
      return { message: "Categories sudah ada" };
    }

    const now = Date.now();
    const categories = [
      // Fragrance Enthusiasts
      {
        name: "Diskusi Umum Parfum",
        icon: "MessageCircle",
        type: "enthusiasts",
        count: 1234,
        order: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Review & Rating",
        icon: "Star",
        type: "enthusiasts",
        count: 856,
        order: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Rekomendasi Parfum",
        icon: "TrendingUp",
        type: "enthusiasts",
        count: 678,
        order: 3,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Koleksi & Showcase",
        icon: "Heart",
        type: "enthusiasts",
        count: 432,
        order: 4,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Marketplace",
        icon: "Users",
        type: "enthusiasts",
        count: 234,
        order: 5,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      // Perfumers/Formulators
      {
        name: "Formula & Resep",
        icon: "MessageCircle",
        type: "formulators",
        count: 189,
        order: 6,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Bahan & Supplier",
        icon: "Star",
        type: "formulators",
        count: 145,
        order: 7,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Teknik Pembuatan",
        icon: "TrendingUp",
        type: "formulators",
        count: 267,
        order: 8,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Peralatan & Tools",
        icon: "Heart",
        type: "formulators",
        count: 98,
        order: 9,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Bisnis Parfum",
        icon: "Users",
        type: "formulators",
        count: 156,
        order: 10,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Insert semua categories
    for (const category of categories) {
      await ctx.db.insert("categories", category);
    }

    return {
      message: "Categories berhasil diinisialisasi",
      count: categories.length,
    };
  },
});

// Mutation untuk update category count
export const updateCategoryCount = mutation({
  args: { categoryName: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("name"), args.categoryName))
      .unique();

    if (!category) {
      return;
    }

    // Hitung jumlah topics dalam category ini
    const topicsCount = await ctx.db
      .query("topics")
      .withIndex("by_category", (q) => q.eq("category", args.categoryName))
      .collect();

    await ctx.db.patch(category._id, {
      count: topicsCount.length,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk update semua category counts
export const updateAllCategoryCounts = mutation({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    for (const category of categories) {
      const topicsCount = await ctx.db
        .query("topics")
        .withIndex("by_category", (q) => q.eq("category", category.name))
        .collect();

      await ctx.db.patch(category._id, {
        count: topicsCount.length,
        updatedAt: Date.now(),
      });
    }

    return { message: "Semua category counts berhasil diupdate" };
  },
});
