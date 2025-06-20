import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  categories: defineTable({
    name: v.string(),
    icon: v.string(),
    type: v.string(), // "enthusiasts" or "formulators"
    count: v.number(),
    order: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_order", ["order"])
    .index("by_active", ["isActive"]),

  topics: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorId: v.id("users"),
    authorName: v.string(),
    views: v.number(),
    likes: v.number(),
    isHot: v.boolean(),
    isPinned: v.boolean(),
    hasVideo: v.boolean(),
    tags: v.array(v.string()),
    videoUrls: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_category", ["category"])
    .index("by_created_at", ["createdAt"])
    .index("by_likes", ["likes"])
    .index("by_views", ["views"]),

  comments: defineTable({
    topicId: v.id("topics"),
    content: v.string(),
    authorId: v.id("users"),
    authorName: v.string(),
    likes: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_topic", ["topicId"])
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"]),

  topicLikes: defineTable({
    topicId: v.id("topics"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"])
    .index("by_topic_user", ["topicId", "userId"]),

  commentLikes: defineTable({
    commentId: v.id("comments"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_comment", ["commentId"])
    .index("by_user", ["userId"])
    .index("by_comment_user", ["commentId", "userId"]),
});
