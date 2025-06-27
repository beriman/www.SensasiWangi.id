import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import ForumNotificationEmail from "../src/emails/ForumNotificationEmail";
import { sendEmail } from "../src/utils/email";
import * as React from "react";

// Threshold untuk menandai topik sebagai "hot"
const HOT_LIKES_THRESHOLD = 10;
const HOT_VIEWS_THRESHOLD = 100;

const DEFAULT_PREFS = {
  badge: true,
  like: true,
  comment: true,
  product: true,
  order: true,
};

async function allowNotification(
  ctx: any,
  userId: Id<"users">,
  type: string,
) {
  const settings = await ctx.db
    .query("userSettings")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  const prefs = settings?.notificationPreferences ?? DEFAULT_PREFS;
  const key = type as keyof typeof DEFAULT_PREFS;
  return prefs[key] ?? true;
}

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

    if (args.searchQuery) {
      const lower = args.searchQuery.toLowerCase();
      filteredPage = filteredPage.filter(
        (topic) =>
          topic.tags.some((t) => t.toLowerCase().includes(lower)) ||
          topic.title.toLowerCase().includes(lower) ||
          topic.content.toLowerCase().includes(lower),
      );
    }

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

export const advancedSearchTopics = query({
  args: {
    authorId: v.optional(v.id("users")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const queryBuilder = args.authorId
      ? ctx
          .db
          .query("topics")
          .withIndex("by_author", (qq) => qq.eq("authorId", args.authorId))
      : ctx.db.query("topics").withIndex("by_created_at").order("desc");

    const topics = await queryBuilder.collect();

    let results = topics;
    if (args.startDate) {
      results = results.filter((t) => t.createdAt >= args.startDate!);
    }
    if (args.endDate) {
      results = results.filter((t) => t.createdAt <= args.endDate!);
    }
    if (args.tags && args.tags.length > 0) {
      results = results.filter((t) =>
        args.tags!.every((tag) => t.tags.includes(tag)),
      );
    }
    return results;
  },
});

export const saveSearch = mutation({
  args: {
    name: v.string(),
    filters: v.object({
      authorId: v.optional(v.id("users")),
      startDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    await ctx.db.insert("savedSearches", {
      userId: user._id,
      name: args.name,
      filters: args.filters,
      createdAt: Date.now(),
    });
    return true;
  },
});

export const getSavedSearches = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("savedSearches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
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

// Mutation untuk lock/unlock topik
export const toggleLockTopic = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) throw new Error("User tidak ditemukan");

    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error("Topik tidak ditemukan");

    if (topic.authorId !== user._id && user.role !== "admin") {
      throw new Error("Tidak memiliki izin");
    }

    await ctx.db.patch(args.topicId, {
      isLocked: !topic.isLocked,
      updatedAt: Date.now(),
    });

    return !topic.isLocked;
  },
});

// Mutation untuk melaporkan topik
export const reportTopic = mutation({
  args: { topicId: v.id("topics"), reason: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    await ctx.db.insert("topicReports", {
      topicId: args.topicId,
      reporterId: user._id,
      reason: args.reason,
      createdAt: Date.now(),
    });

    return true;
  },
});

// Mutation untuk memberikan vote pada laporan
export const voteReport = mutation({
  args: { reportId: v.id("topicReports"), value: v.union(v.literal(1), v.literal(-1)) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login untuk vote");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const report = await ctx.db.get(args.reportId);
    if (!report) throw new Error("Laporan tidak ditemukan");

    const existing = await ctx.db
      .query("reportVotes")
      .withIndex("by_report_user", (q) =>
        q.eq("reportId", args.reportId).eq("userId", user._id),
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("reportVotes", {
        reportId: args.reportId,
        userId: user._id,
        value: args.value,
        createdAt: Date.now(),
      });
    } else if (existing.value === args.value) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.patch(existing._id, { value: args.value });
    }

    const votes = await ctx.db
      .query("reportVotes")
      .withIndex("by_report", (q) => q.eq("reportId", args.reportId))
      .collect();
    return votes.reduce((sum, v) => sum + v.value, 0);
  },
});

// Query untuk mendapatkan laporan dengan vote terbanyak
export const getTopReports = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const [reports, votes, topics, users] = await Promise.all([
      ctx.db.query("topicReports").collect(),
      ctx.db.query("reportVotes").collect(),
      ctx.db.query("topics").collect(),
      ctx.db.query("users").collect(),
    ]);

    const voteMap = new Map<string, number>();
    for (const v of votes) {
      voteMap.set(v.reportId, (voteMap.get(v.reportId) ?? 0) + v.value);
    }
    const topicMap = new Map(topics.map((t) => [t._id, t.title]));
    const userMap = new Map(users.map((u) => [u._id, u.name]));

    const queue = reports.map((r) => ({
      id: r._id,
      topicTitle: topicMap.get(r.topicId) ?? "",
      reporter: userMap.get(r.reporterId) ?? "Unknown",
      reason: r.reason,
      votes: voteMap.get(r._id) ?? 0,
      createdAt: r.createdAt,
    }));

    queue.sort((a, b) => b.votes - a.votes);
    return queue.slice(0, args.limit ?? queue.length);
  },
});

// Mutation untuk menandai topik sebagai solved
export const markTopicSolved = mutation({
  args: { topicId: v.id("topics"), commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error("Topik tidak ditemukan");

    if (topic.authorId !== user._id) {
      throw new Error("Bukan pemilik topik");
    }

    await ctx.db.patch(args.topicId, {
      solvedCommentId: args.commentId,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Query untuk mendapatkan semua topik yang dipin
export const getPinnedTopics = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const q = args.category
      ? ctx.db
          .query("topics")
          .withIndex("by_category", (qq) => qq.eq("category", args.category))
      : ctx.db.query("topics").withIndex("by_created_at");

    return await q
      .filter((qq) => qq.eq(qq.field("isPinned"), true))
      .order("desc")
      .collect();
  },
});

// Query untuk mendapatkan topik yang hot
export const getHotTopics = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_likes")
      .order("desc")
      .collect();

    const hot = topics
      .filter((t) => t.isHot)
      .slice(0, args.limit ?? 10);

    return hot;
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

export const isUserSubscribed = query({
  args: { topicId: v.id("topics"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const sub = await ctx.db
      .query("topicSubscriptions")
      .withIndex("by_topic_user", (q) =>
        q.eq("topicId", args.topicId).eq("userId", args.userId),
      )
      .unique();
    return !!sub;
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
      isLocked: false,
      solvedCommentId: undefined,
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
    const oldBadgeCount = newBadges.length;

    if (newPoints >= 100 && !newBadges.includes("Kontributor Aktif")) {
      newBadges.push("Kontributor Aktif");
    }
    if (newPoints >= 500 && !newBadges.includes("Master Diskusi")) {
      newBadges.push("Master Diskusi");
    }

    await ctx.db.patch(user._id, {
      contributionPoints: newPoints,
      weeklyContributionPoints: (user.weeklyContributionPoints ?? 0) + 10,
      badges: newBadges,
    });

    await ctx.runMutation(internal.points.recordPointEvent, {
      userId: user._id,
      activity: "create_topic",
      points: 10,
    });

    // Buat notifikasi untuk badge baru
    if (newBadges.length > oldBadgeCount) {
      const newBadge = newBadges[newBadges.length - 1];
      if (await allowNotification(ctx, user._id, "badge")) {
        await ctx.db.insert("notifications", {
          userId: user._id,
          type: "badge",
          message: `Selamat! Anda mendapatkan badge "${newBadge}" karena membuat topik baru`,
          read: false,
          createdAt: Date.now(),
        });
      }
    }

    // Mention notifications
    const mentionMatches = args.content.match(/@([A-Za-z0-9_]+)/g) || [];
    const mentioned = Array.from(new Set(mentionMatches.map((m) => m.slice(1))));
    for (const name of mentioned) {
      const target = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("name"), name))
        .unique();
      if (target && target._id !== user._id) {
        if (await allowNotification(ctx, target._id, "comment")) {
          await ctx.db.insert("notifications", {
            userId: target._id,
            type: "mention",
            message: `${user.name || "Anonymous"} menyebut Anda di topik "${args.title}"`,
            url: `/forum?topic=${topicId}`,
            read: false,
            createdAt: Date.now(),
          });
        }
      }
    }

    // Update category count setelah topic dibuat
    await ctx.scheduler.runAfter(0, "forum:updateCategoryCount" as any, {
      categoryName: args.category,
    });

    return topicId;
  },
});

// Mutation untuk mengedit topik
export const editTopic = mutation({
  args: { topicId: v.id("topics"), title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error("Topik tidak ditemukan");
    if (topic.authorId !== user._id) throw new Error("Bukan pemilik topik");

    await ctx.db.insert("edits", {
      docType: "topic",
      docId: topic._id,
      editorId: user._id,
      previousTitle: topic.title,
      previousContent: topic.content,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.topicId, {
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
    });

    return true;
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

      // Buat notifikasi untuk pemilik topik (jika bukan like sendiri)
      if (topic.authorId !== user._id) {
        if (await allowNotification(ctx, topic.authorId, "like")) {
          await ctx.db.insert("notifications", {
            userId: topic.authorId,
            type: "like",
            message: `${user.name || "Anonymous"} menyukai topik Anda "${topic.title}"`,
            url: `/forum?topic=${topic._id}`,
            read: false,
            createdAt: Date.now(),
          });
        }
      }
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

export const subscribeTopic = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const existing = await ctx.db
      .query("topicSubscriptions")
      .withIndex("by_topic_user", (q) =>
        q.eq("topicId", args.topicId).eq("userId", user._id),
      )
      .unique();
    if (existing) return false;

    await ctx.db.insert("topicSubscriptions", {
      topicId: args.topicId,
      userId: user._id,
      createdAt: Date.now(),
    });
    return true;
  },
});

export const unsubscribeTopic = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const existing = await ctx.db
      .query("topicSubscriptions")
      .withIndex("by_topic_user", (q) =>
        q.eq("topicId", args.topicId).eq("userId", user._id),
      )
      .unique();
    if (!existing) return false;

    await ctx.db.delete(existing._id);
    return true;
  },
});

// Mutation untuk upvote/downvote topik
export const toggleTopicVote = mutation({
  args: {
    topicId: v.id("topics"),
    value: v.union(v.literal(1), v.literal(-1)),
  },
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

    await ctx.db.patch(args.topicId, {
      score: newScore,
      updatedAt: Date.now(),
    });

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

    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topik tidak ditemukan");
    }
    if (topic.isLocked) {
      throw new Error("Diskusi telah dikunci");
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
    const oldBadgeCount = newBadges.length;

    if (newPoints >= 100 && !newBadges.includes("Kontributor Aktif")) {
      newBadges.push("Kontributor Aktif");
    }
    if (newPoints >= 500 && !newBadges.includes("Master Diskusi")) {
      newBadges.push("Master Diskusi");
    }

    await ctx.db.patch(user._id, {
      contributionPoints: newPoints,
      weeklyContributionPoints: (user.weeklyContributionPoints ?? 0) + 2,
      badges: newBadges,
    });

    await ctx.runMutation(internal.points.recordPointEvent, {
      userId: user._id,
      activity: "create_comment",
      points: 2,
    });

    // Buat notifikasi untuk badge baru
    if (newBadges.length > oldBadgeCount) {
      const newBadge = newBadges[newBadges.length - 1];
      if (await allowNotification(ctx, user._id, "badge")) {
        await ctx.db.insert("notifications", {
          userId: user._id,
          type: "badge",
          message: `Selamat! Anda mendapatkan badge "${newBadge}" karena aktif berkomentar`,
          read: false,
          createdAt: Date.now(),
        });
      }
    }

    // Mention notifications
    const mentionMatches = args.content.match(/@([A-Za-z0-9_]+)/g) || [];
    const mentioned = Array.from(new Set(mentionMatches.map((m) => m.slice(1))));
    for (const name of mentioned) {
      const target = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("name"), name))
        .unique();
      if (target && target._id !== user._id) {
        if (await allowNotification(ctx, target._id, "comment")) {
          await ctx.db.insert("notifications", {
            userId: target._id,
            type: "mention",
            message: `${user.name || "Anonymous"} menyebut Anda di komentar`,
            url: `/forum?topic=${args.topicId}`,
            read: false,
            createdAt: now,
          });
        }
      }
    }

    if (topic && topic.authorId !== user._id) {
      if (await allowNotification(ctx, topic.authorId, "comment")) {
        await ctx.db.insert("notifications", {
          userId: topic.authorId,
          type: "comment",
          message: `${user.name || "Anonymous"} mengomentari topik Anda "${topic.title}"`,
          url: `/forum?topic=${topic._id}`,
          read: false,
          createdAt: now,
        });
      }
    }

    await ctx.scheduler.runAfter(0, internal.forum.sendReplyNotifications, {
      commentId,
    });

    return commentId;
  },
});

// Mutation untuk mengedit komentar
export const editComment = mutation({
  args: { commentId: v.id("comments"), content: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User tidak ditemukan");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Komentar tidak ditemukan");
    if (comment.authorId !== user._id) throw new Error("Bukan pemilik komentar");

    await ctx.db.insert("edits", {
      docType: "comment",
      docId: comment._id,
      editorId: user._id,
      previousContent: comment.content,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Mutation untuk upvote/downvote komentar
export const toggleCommentVote = mutation({
  args: {
    commentId: v.id("comments"),
    value: v.union(v.literal(1), v.literal(-1)),
  },
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

    await ctx.db.patch(args.commentId, {
      score: newScore,
      updatedAt: Date.now(),
    });
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

// Query untuk mendapatkan riwayat edit
export const getEditHistory = query({
  args: { docType: v.string(), docId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("edits")
      .withIndex("by_doc", (q) =>
        q.eq("docType", args.docType).eq("docId", args.docId),
      )
      .order("desc")
      .collect();
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

// Mutation untuk memindahkan topik ke kategori lain (hanya admin)
export const moveTopic = mutation({
  args: { topicId: v.id("topics"), newCategory: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!admin) throw new Error("User tidak ditemukan");
    if (admin.role !== "admin") throw new Error("Tidak memiliki izin");

    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error("Topik tidak ditemukan");

    if (topic.category === args.newCategory) return true;

    await ctx.db.insert("edits", {
      docType: "topic",
      docId: topic._id,
      editorId: admin._id,
      previousTitle: topic.title,
      previousContent: `category:${topic.category}`,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.topicId, {
      category: args.newCategory,
      updatedAt: Date.now(),
    });

    if (topic.authorId !== admin._id) {
      await ctx.db.insert("notifications", {
        userId: topic.authorId,
        type: "moderation",
        message: `Topik Anda "${topic.title}" dipindahkan ke kategori ${args.newCategory}`,
        url: `/forum?topic=${topic._id}`,
        read: false,
        createdAt: Date.now(),
      });
    }

    await ctx.scheduler.runAfter(0, "forum:updateCategoryCount" as any, {
      categoryName: topic.category,
    });
    await ctx.scheduler.runAfter(0, "forum:updateCategoryCount" as any, {
      categoryName: args.newCategory,
    });

    return true;
  },
});

// Mutation untuk menggabungkan dua topik (hanya admin)
export const mergeTopics = mutation({
  args: { sourceId: v.id("topics"), targetId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anda harus login");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!admin) throw new Error("User tidak ditemukan");
    if (admin.role !== "admin") throw new Error("Tidak memiliki izin");

    if (args.sourceId === args.targetId) return true;

    const source = await ctx.db.get(args.sourceId);
    const target = await ctx.db.get(args.targetId);
    if (!source || !target) throw new Error("Topik tidak ditemukan");

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_topic", (q) => q.eq("topicId", args.sourceId))
      .collect();
    for (const c of comments) {
      await ctx.db.patch(c._id, { topicId: args.targetId });
    }

    const likes = await ctx.db
      .query("topicLikes")
      .withIndex("by_topic", (q) => q.eq("topicId", args.sourceId))
      .collect();
    let addedLikes = 0;
    for (const like of likes) {
      const existing = await ctx.db
        .query("topicLikes")
        .withIndex("by_topic_user", (q) =>
          q.eq("topicId", args.targetId).eq("userId", like.userId),
        )
        .unique();
      if (existing) {
        await ctx.db.delete(like._id);
      } else {
        await ctx.db.patch(like._id, { topicId: args.targetId });
        addedLikes++;
      }
    }

    await ctx.db.patch(args.targetId, {
      likes: target.likes + addedLikes,
      views: target.views + source.views,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("edits", {
      docType: "topic",
      docId: target._id,
      editorId: admin._id,
      previousTitle: `[merge] ${source.title}`,
      previousContent: source.content,
      createdAt: Date.now(),
    });

    await ctx.db.insert("edits", {
      docType: "topic",
      docId: source._id,
      editorId: admin._id,
      previousTitle: source.title,
      previousContent: "merged into another topic",
      createdAt: Date.now(),
    });

    if (source.authorId !== admin._id) {
      await ctx.db.insert("notifications", {
        userId: source.authorId,
        type: "moderation",
        message: `Topik Anda "${source.title}" digabungkan ke "${target.title}"`,
        url: `/forum?topic=${args.targetId}`,
        read: false,
        createdAt: Date.now(),
      });
    }
    if (target.authorId !== admin._id) {
      await ctx.db.insert("notifications", {
        userId: target.authorId,
        type: "moderation",
        message: `Topik "${source.title}" digabungkan ke topik Anda`,
        url: `/forum?topic=${args.targetId}`,
        read: false,
        createdAt: Date.now(),
      });
    }

    await ctx.db.delete(args.sourceId);

    await ctx.scheduler.runAfter(0, "forum:updateCategoryCount" as any, {
      categoryName: source.category,
    });
    await ctx.scheduler.runAfter(0, "forum:updateCategoryCount" as any, {
      categoryName: target.category,
    });

    return true;
  },
});

export const sendReplyNotifications = internalMutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) return;
    const topic = await ctx.db.get(comment.topicId);
    if (!topic) return;
    const subs = await ctx.db
      .query("topicSubscriptions")
      .withIndex("by_topic", (q) => q.eq("topicId", comment.topicId))
      .collect();
    for (const sub of subs) {
      if (sub.userId === comment.authorId) continue;
      const user = await ctx.db.get(sub.userId);
      if (!user?.email) continue;
      await sendEmail({
        to: user.email,
        subject: `Balasan baru di ${topic.title}`,
        react: React.createElement(ForumNotificationEmail, {
          topic: topic.title,
          message: `${comment.authorName} membalas topik`,
          url: `/forum?topic=${topic._id}`,
        }),
      });
    }
  },
});
