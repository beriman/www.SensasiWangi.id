import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
    role: v.string(),
    contributionPoints: v.number(),
    badges: v.array(v.string()),
    experiencePoints: v.number(), // Baru: Poin pengalaman untuk leveling
    level: v.number(),            // Baru: Level pengguna
    achievements: v.array(v.id("achievements")), // Baru: Prestasi yang diraih
    createdAt: v.number(),
    reviewCount: v.number(),
    helpfulCount: v.number(),
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
    score: v.number(),
    isHot: v.boolean(),
    isPinned: v.boolean(),
    isLocked: v.boolean(),
    solvedCommentId: v.optional(v.id("comments")),
    hasVideo: v.boolean(),
    hasImages: v.boolean(),
    tags: v.array(v.string()),
    videoUrls: v.optional(v.array(v.string())),
    imageUrls: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_category", ["category"])
    .index("by_created_at", ["createdAt"])
    .index("by_likes", ["likes"])
    .index("by_views", ["views"])
    .searchIndex("search_title", { searchField: "title", filterFields: ["category"] }),

  comments: defineTable({
    topicId: v.id("topics"),
    content: v.string(),
    authorId: v.id("users"),
    authorName: v.string(),
    likes: v.number(),
    score: v.number(),
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

  topicVotes: defineTable({
    topicId: v.id("topics"),
    userId: v.id("users"),
    value: v.number(),
    createdAt: v.number(),
  })
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"])
    .index("by_topic_user", ["topicId", "userId"]),

  commentVotes: defineTable({
    commentId: v.id("comments"),
    userId: v.id("users"),
    value: v.number(),
    createdAt: v.number(),
  })
    .index("by_comment", ["commentId"])
    .index("by_user", ["userId"])
    .index("by_comment_user", ["commentId", "userId"]),

  topicReports: defineTable({
    topicId: v.id("topics"),
    reporterId: v.id("users"),
    reason: v.string(),
    createdAt: v.number(),
  })
    .index("by_topic", ["topicId"])
    .index("by_reporter", ["reporterId"])
    .index("by_topic_reporter", ["topicId", "reporterId"]),

  products: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(), // Tambah field stok
    originalPrice: v.optional(v.number()),
    category: v.string(),
    condition: v.string(), // "new", "like-new", "good", "fair"
    brand: v.string(),
    size: v.string(),
    images: v.array(v.string()),
    sellerId: v.id("users"),
    sellerName: v.string(),
    status: v.string(), // "active", "sold", "inactive"
    location: v.string(),
    shippingOptions: v.array(v.string()),
    tags: v.array(v.string()),
    views: v.number(),
    likes: v.number(),
    sambatCount: v.number(),
    isNegotiable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"])
    .index("by_price", ["price"])
    .index("by_views", ["views"])
    .index("by_likes", ["likes"]),

  productLikes: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_product_user", ["productId", "userId"]),

  sambats: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    userName: v.string(),
    message: v.string(),
    offerPrice: v.optional(v.number()),
    status: v.string(), // "pending", "accepted", "rejected", "expired"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  orders: defineTable({
    productId: v.id("products"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    buyerName: v.string(),
    sellerName: v.string(),
    productTitle: v.string(),
    price: v.number(),
    shippingAddress: v.object({
      name: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      postalCode: v.string(),
      province: v.string(),
    }),
    origin: v.string(),
    destination: v.string(),
    shippingMethod: v.string(),
    shippingCost: v.number(),
    totalAmount: v.number(),
    paymentMethod: v.string(),
    paymentStatus: v.string(), // "pending", "paid", "failed", "refunded"
    orderStatus: v.string(), // "pending", "confirmed", "shipped", "delivered", "cancelled"
    virtualAccountNumber: v.optional(v.string()),
    paymentExpiry: v.optional(v.number()),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    paymentProofUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_product", ["productId"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_order_status", ["orderStatus"])
    .index("by_created_at", ["createdAt"]),

  orderTracking: defineTable({
    orderId: v.id("orders"),
    manifestCode: v.optional(v.string()),
    description: v.string(),
    cityName: v.optional(v.string()),
    manifestDate: v.string(),
    manifestTime: v.string(),
    createdAt: v.number(),
  }).index("by_order", ["orderId"]),

  reviews: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    reviewerId: v.id("users"),
    reviewerName: v.string(),
    targetUserId: v.id("users"), // seller or buyer being reviewed
    targetUserName: v.string(),
    rating: v.number(), // 1-5
    comment: v.string(),
    type: v.string(), // "seller" or "buyer"
    createdAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_product", ["productId"])
    .index("by_reviewer", ["reviewerId"])
    .index("by_target_user", ["targetUserId"])
    .index("by_rating", ["rating"])
    .index("by_created_at", ["createdAt"]),

  sambatProducts: defineTable({
    title: v.string(),
    description: v.string(),
    brand: v.string(),
    category: v.string(),
    originalPrice: v.number(), // harga asli produk
    pricePerPortion: v.number(), // harga per porsi
    totalPortions: v.number(), // total porsi yang tersedia
    minParticipants: v.number(), // minimum peserta untuk sambatan berhasil
    maxParticipants: v.number(), // maksimum peserta
    currentParticipants: v.number(), // jumlah peserta saat ini
    images: v.array(v.string()),
    sellerId: v.id("users"),
    sellerName: v.string(),
    status: v.string(), // "active", "full", "completed", "cancelled"
    location: v.string(),
    shippingOptions: v.array(v.string()),
    tags: v.array(v.string()),
    views: v.number(),
    likes: v.number(),
    deadline: v.number(), // deadline untuk sambatan
    portionSize: v.string(), // ukuran per porsi (misal: 10ml, 5ml)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"])
    .index("by_deadline", ["deadline"])
    .index("by_views", ["views"])
    .index("by_likes", ["likes"]),

  sambatEnrollments: defineTable({
    sambatProductId: v.id("sambatProducts"),
    userId: v.id("users"),
    userName: v.string(),
    portionsRequested: v.number(), // jumlah porsi yang diminta
    totalAmount: v.number(), // total yang harus dibayar
    paymentStatus: v.string(), // "pending", "paid", "failed", "refunded"
    shippingAddress: v.object({
      name: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      postalCode: v.string(),
      province: v.string(),
    }),
    origin: v.string(),
    destination: v.string(),
    shippingMethod: v.string(),
    shippingCost: v.number(),
    virtualAccountNumber: v.optional(v.string()),
    paymentExpiry: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sambat_product", ["sambatProductId"])
    .index("by_user", ["userId"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_created_at", ["createdAt"]),

  sambatProductLikes: defineTable({
    sambatProductId: v.id("sambatProducts"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_sambat_product", ["sambatProductId"])
    .index("by_user", ["userId"])
    .index("by_sambat_product_user", ["sambatProductId", "userId"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    website: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    avatar: v.optional(v.string()),
    isVerified: v.boolean(),
    rating: v.number(),
    totalReviews: v.number(),
    totalSales: v.number(),
    totalPurchases: v.number(),
    joinedAt: v.number(),
    lastActive: v.number(),
    privacySettings: v.optional(v.object({ // Baru: Pengaturan privasi
      showEmail: v.boolean(),
      showPhone: v.boolean(),
      showActivity: v.boolean(),
    })),
    notificationPreferences: v.optional(v.object({ // Baru: Preferensi notifikasi
      email: v.boolean(),
      push: v.boolean(),
      inApp: v.boolean(),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_verified", ["isVerified"]),

  suggestions: defineTable({
    name: v.string(),
    email: v.string(),
    type: v.string(), // "suggestion" or "bug_report"
    subject: v.string(),
    message: v.string(),
    status: v.string(), // "pending", "in_progress", "resolved", "closed"
    priority: v.string(), // "low", "medium", "high", "urgent"
    userId: v.optional(v.id("users")),
    adminNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  brands: defineTable({
    name: v.string(),
    description: v.string(),
    logo: v.optional(v.string()),
    website: v.optional(v.string()),
    country: v.string(), // "Indonesia"
    city: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
    category: v.string(), // "Local", "Artisan", "Commercial", "Niche"
    isActive: v.boolean(),
    verificationStatus: v.string(), // "unverified", "pending", "approved", "rejected"
    totalProducts: v.number(),
    rating: v.number(),
    totalReviews: v.number(),
    views: v.number(),
    likes: v.number(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_country", ["country"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_rating", ["rating"])
    .index("by_views", ["views"])
    .index("by_likes", ["likes"])
    .index("by_created_at", ["createdAt"]),

  perfumers: defineTable({
    name: v.string(),
    bio: v.string(),
    photo: v.optional(v.string()),
    nationality: v.string(), // "Indonesia"
    city: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    education: v.optional(v.string()),
    experience: v.string(), // "Beginner", "Intermediate", "Expert", "Master"
    specialties: v.array(v.string()), // ["Floral", "Woody", "Oriental", etc.]
    brandsWorkedWith: v.array(v.string()),
    achievements: v.array(v.string()),
    socialMedia: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        website: v.optional(v.string()),
        linkedin: v.optional(v.string()),
      }),
    ),
    isActive: v.boolean(),
    verificationStatus: v.string(),
    totalCreations: v.number(),
    rating: v.number(),
    totalReviews: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_nationality", ["nationality"])
    .index("by_experience", ["experience"])
    .index("by_active", ["isActive"])
    .index("by_rating", ["rating"])
    .index("by_created_at", ["createdAt"]),

  fragrances: defineTable({
    name: v.string(),
    brandId: v.id("brands"),
    brandName: v.string(),
    perfumerId: v.optional(v.id("perfumers")),
    perfumerName: v.optional(v.string()),
    description: v.string(),
    images: v.array(v.string()),
    category: v.string(), // "Citrus", "Floral", "Woody", "Oriental", "Fresh", "Gourmand"
    concentration: v.string(), // "EDT", "EDP", "Parfum", "Cologne"
    topNotes: v.array(v.string()),
    middleNotes: v.array(v.string()),
    baseNotes: v.array(v.string()),
    sillage: v.string(), // "Light", "Moderate", "Heavy", "Enormous"
    longevity: v.string(), // "Very Weak", "Weak", "Moderate", "Long Lasting", "Eternal"
    season: v.array(v.string()), // ["Spring", "Summer", "Fall", "Winter"]
    occasion: v.array(v.string()), // ["Daily", "Office", "Evening", "Special"]
    gender: v.string(), // "Unisex", "Men", "Women"
    launchYear: v.optional(v.number()),
    price: v.optional(v.number()),
    sizes: v.array(v.string()), // ["30ml", "50ml", "100ml"]
    isDiscontinued: v.boolean(),
    verificationStatus: v.string(),
    rating: v.number(),
    totalReviews: v.number(),
    totalLikes: v.number(),
    views: v.number(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_brand", ["brandId"])
    .index("by_perfumer", ["perfumerId"])
    .index("by_category", ["category"])
    .index("by_concentration", ["concentration"])
    .index("by_gender", ["gender"])
    .index("by_rating", ["rating"])
    .index("by_views", ["views"])
    .index("by_likes", ["totalLikes"])
    .index("by_created_at", ["createdAt"]),

  fragranceReviews: defineTable({
    fragranceId: v.id("fragrances"),
    userId: v.id("users"),
    userName: v.string(),
    rating: v.number(), // 1-5
    title: v.string(),
    content: v.string(),
    pros: v.array(v.string()),
    cons: v.array(v.string()),
    sillageRating: v.number(), // 1-5
    longevityRating: v.number(), // 1-5
    valueRating: v.number(), // 1-5
    recommendedFor: v.array(v.string()),
    photos: v.optional(v.array(v.string())),
    isVerifiedPurchase: v.boolean(),
    helpfulVotes: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_fragrance", ["fragranceId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_created_at", ["createdAt"]),

  fragranceLikes: defineTable({
    fragranceId: v.id("fragrances"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_fragrance", ["fragranceId"])
    .index("by_user", ["userId"])
    .index("by_fragrance_user", ["fragranceId", "userId"]),

  brandLikes: defineTable({
    brandId: v.id("brands"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_brand", ["brandId"])
    .index("by_user", ["userId"])
    .index("by_brand_user", ["brandId", "userId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    itemId: v.string(),
    itemType: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_item", ["itemId"])
    .index("by_user_item", ["userId", "itemId"]),

  messages: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"])
    .index("by_conversation", ["senderId", "recipientId"])
    .index("by_created_at", ["createdAt"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    message: v.string(),
    url: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_read", ["read"])
    .index("by_created_at", ["createdAt"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_pair", ["followerId", "followingId"]),

  userSettings: defineTable({
    userId: v.id("users"),
    notificationPreferences: v.object({
      badge: v.boolean(),
      like: v.boolean(),
      comment: v.boolean(),
      product: v.boolean(),
      order: v.boolean(),
    }),
  }).index("by_user", ["userId"]),

  // === Courses & Lessons ===
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    level: v.string(),
    price: v.number(),
    image: v.optional(v.string()),
    instructor: v.string(),
    discussionTopicId: v.optional(v.id("topics")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_level", ["level"])
    .index("by_created_at", ["createdAt"]),

  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    videoUrl: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_course_order", ["courseId", "order"])
    .index("by_course", ["courseId"]),

  progress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    progress: v.number(),
    completed: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_user_lesson", ["userId", "lessonId"])
    .index("by_user", ["userId"]),

  quizzes: defineTable({
    lessonId: v.id("lessons"),
    question: v.string(),
    options: v.array(v.string()),
    correctOption: v.number(),
    createdAt: v.number(),
  }).index("by_lesson", ["lessonId"]),

  quizResults: defineTable({
    lessonId: v.id("lessons"),
    userId: v.id("users"),
    answers: v.array(v.number()),
    score: v.number(),
    createdAt: v.number(),
  })
    .index("by_user_lesson", ["userId", "lessonId"])
    .index("by_user", ["userId"]),

  certificates: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    url: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_course", ["userId", "courseId"])
    .index("by_user", ["userId"]),

  lessonNotes: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    note: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user_lesson", ["userId", "lessonId"])
    .index("by_user", ["userId"]),

  edits: defineTable({
    docType: v.string(), // "topic" or "comment"
    docId: v.string(),
    editorId: v.id("users"),
    previousTitle: v.optional(v.string()),
    previousContent: v.string(),
    createdAt: v.number(),
  }).index("by_doc", ["docType", "docId"]),
});
