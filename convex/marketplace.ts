import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { createVirtualAccount } from "../src/utils/bri";

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

// Query untuk mendapatkan semua produk dengan pagination
export const getProducts = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    category: v.optional(v.string()),
    condition: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "active"));

    // Sorting
    if (args.sortBy === "price_low") {
      query = ctx.db.query("products").withIndex("by_price").order("asc");
    } else if (args.sortBy === "price_high") {
      query = ctx.db.query("products").withIndex("by_price").order("desc");
    } else if (args.sortBy === "popular") {
      query = ctx.db.query("products").withIndex("by_views").order("desc");
    } else if (args.sortBy === "liked") {
      query = ctx.db.query("products").withIndex("by_likes").order("desc");
    } else {
      query = ctx.db.query("products").withIndex("by_created_at").order("desc");
    }

    const products = await query.paginate(args.paginationOpts);

    // Filter berdasarkan kriteria
    let filteredProducts = products.page.filter(
      (product) => product.status === "active",
    );

    if (args.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === args.category,
      );
    }

    if (args.condition) {
      filteredProducts = filteredProducts.filter(
        (product) => product.condition === args.condition,
      );
    }

    if (args.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= args.minPrice!,
      );
    }

    if (args.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= args.maxPrice!,
      );
    }

    if (args.location) {
      filteredProducts = filteredProducts.filter((product) =>
        product.location.toLowerCase().includes(args.location!.toLowerCase()),
      );
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    return {
      ...products,
      page: filteredProducts,
    };
  },
});

// Query untuk mendapatkan produk berdasarkan ID
export const getProductById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// Query untuk mendapatkan produk berdasarkan seller
export const getProductsBySeller = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId))
      .order("desc")
      .collect();
  },
});

// Query untuk cek apakah user sudah like produk
export const hasUserLikedProduct = query({
  args: { productId: v.id("products"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("productLikes")
      .withIndex("by_product_user", (q) =>
        q.eq("productId", args.productId).eq("userId", args.userId),
      )
      .unique();
    return !!like;
  },
});

// Query untuk mendapatkan sambat berdasarkan produk
export const getSambatsByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sambats")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

// Query untuk mendapatkan user profile
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    return {
      user,
      profile,
    };
  },
});

// Query untuk mendapatkan orders berdasarkan user
export const getOrdersByUser = query({
  args: { userId: v.id("users"), type: v.string() }, // "buyer" or "seller"
  handler: async (ctx, args) => {
    if (args.type === "buyer") {
      return await ctx.db
        .query("orders")
        .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId))
        .order("desc")
        .collect();
    } else {
      return await ctx.db
        .query("orders")
        .withIndex("by_seller", (q) => q.eq("sellerId", args.userId))
        .order("desc")
        .collect();
    }
  },
});

// Query untuk mendapatkan order berdasarkan ID
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Query untuk mendapatkan review berdasarkan produk
export const getReviewsByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

// Query untuk mendapatkan review berdasarkan target user
export const getReviewsByTargetUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_target_user", (q) => q.eq("targetUserId", args.userId))
      .order("desc")
      .collect();
  },
});

// Mutation untuk membuat produk baru
export const createProduct = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    category: v.string(),
    condition: v.string(),
    brand: v.string(),
    size: v.string(),
    images: v.array(v.string()),
    location: v.string(),
    shippingOptions: v.array(v.string()),
    tags: v.array(v.string()),
    isNegotiable: v.boolean(),
    stock: v.number(), // Tambah parameter stok
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk menjual produk");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Update user role to seller if not already
    if (user.role === "buyer") {
      await ctx.db.patch(user._id, { role: "seller" });
    }

    const now = Date.now();

    const productId = await ctx.db.insert("products", {
      title: args.title,
      description: args.description,
      price: args.price,
      originalPrice: args.originalPrice,
      category: args.category,
      condition: args.condition,
      brand: args.brand,
      size: args.size,
      images: args.images,
      sellerId: user._id,
      sellerName: user.name || "Anonymous",
      status: "active",
      location: args.location,
      shippingOptions: args.shippingOptions,
      tags: args.tags,
      views: 0,
      likes: 0,
      sambatCount: 0,
      isNegotiable: args.isNegotiable,
      stock: args.stock, // Set nilai stok
      createdAt: now,
      updatedAt: now,
    });

    // Award contribution points for creating product
    await ctx.db.patch(user._id, {
      contributionPoints: (user.contributionPoints || 0) + 10,
    });

    // Create notification for successful product creation
    if (await allowNotification(ctx, user._id, "product")) {
      await ctx.db.insert("notifications", {
        userId: user._id,
        type: "product",
        message: `Produk "${args.title}" berhasil dipublikasikan di marketplace`,
        url: `/marketplace/product/${productId}`,
        read: false,
        createdAt: now,
      });
    }

    return productId;
  },
});

// Mutation untuk like/unlike produk
export const toggleProductLike = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk like produk");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const existingLike = await ctx.db
      .query("productLikes")
      .withIndex("by_product_user", (q) =>
        q.eq("productId", args.productId).eq("userId", user._id),
      )
      .unique();

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.productId, {
        likes: Math.max(0, product.likes - 1),
        updatedAt: Date.now(),
      });
      return false;
    } else {
      await ctx.db.insert("productLikes", {
        productId: args.productId,
        userId: user._id,
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.productId, {
        likes: product.likes + 1,
        updatedAt: Date.now(),
      });
      return true;
    }
  },
});

// Mutation untuk increment view count
export const incrementProductViews = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    await ctx.db.patch(args.productId, {
      views: product.views + 1,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk membuat sambat
export const createSambat = mutation({
  args: {
    productId: v.id("products"),
    message: v.string(),
    offerPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk sambat");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    // Cek apakah user adalah pemilik produk
    if (product.sellerId === user._id) {
      throw new Error("Anda tidak bisa sambat produk sendiri");
    }

    const now = Date.now();

    const sambatId = await ctx.db.insert("sambats", {
      productId: args.productId,
      userId: user._id,
      userName: user.name || "Anonymous",
      message: args.message,
      offerPrice: args.offerPrice,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Update sambat count di produk
    await ctx.db.patch(args.productId, {
      sambatCount: product.sambatCount + 1,
      updatedAt: now,
    });

    return sambatId;
  },
});

// Mutation untuk membuat order
export const createOrder = mutation({
  args: {
    productId: v.id("products"),
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
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk membeli");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    if (product.status !== "active") {
      throw new Error("Produk tidak tersedia");
    }

    // Cek stok tersedia
    if (product.stock < 1) {
      throw new Error("Produk sudah habis");
    }

    if (product.sellerId === user._id) {
      throw new Error("Anda tidak bisa membeli produk sendiri");
    }

    const seller = await ctx.db.get(product.sellerId);
    if (!seller) {
      throw new Error("Penjual tidak ditemukan");
    }

    const now = Date.now();
    const points = user.contributionPoints ?? 0;
    const discountRate = points >= 500 ? 0.1 : points >= 100 ? 0.05 : 0;
    const discountedPrice = product.price - product.price * discountRate;
    const totalAmount = discountedPrice + args.shippingCost;

    let vaNumber = "";
    let paymentExpiry = now + 24 * 60 * 60 * 1000;
    try {
      const va = await createVirtualAccount(
        `${now}`,
        totalAmount,
        user.name || "Pembeli",
      );
      vaNumber = va.virtualAccount;
      paymentExpiry = new Date(va.expiredDate).getTime();
    } catch (err) {
      console.error("Failed to create BRI VA", err);
      vaNumber = `8808${Date.now().toString().slice(-8)}`;
    }

    const orderId = await ctx.db.insert("orders", {
      productId: args.productId,
      buyerId: user._id,
      sellerId: product.sellerId,
      buyerName: user.name || "Anonymous",
      sellerName: seller.name || "Anonymous",
      productTitle: product.title,
      price: discountedPrice,
      shippingAddress: args.shippingAddress,
      origin: args.origin,
      destination: args.destination,
      shippingMethod: args.shippingMethod,
      shippingCost: args.shippingCost,
      totalAmount,
      paymentMethod: args.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      virtualAccountNumber: vaNumber,
      paymentExpiry,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Update status dan kurangi stok
    await ctx.db.patch(args.productId, {
      status: "sold",
      stock: product.stock - 1, // Kurangi stok
      updatedAt: now,
    });

    return orderId;
  },
});

// Mutation untuk update payment status
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    await ctx.db.patch(args.orderId, {
      paymentStatus: args.paymentStatus,
      orderStatus: args.paymentStatus === "paid" ? "confirmed" : "pending",
      updatedAt: Date.now(),
    });

    if (args.paymentStatus === "paid") {
      const buyer = await ctx.db.get(order.buyerId);
      if (buyer) {
        await ctx.db.patch(buyer._id, {
          contributionPoints: (buyer.contributionPoints ?? 0) + 5,
        });
      }
    }

    // Jika payment failed, kembalikan status dan stok produk
    if (args.paymentStatus === "failed") {
      const product = await ctx.db.get(order.productId);
      if (product) {
        await ctx.db.patch(order.productId, {
          status: "active",
          stock: (product.stock || 0) + 1, // Kembalikan stok
          updatedAt: Date.now(),
        });
      }
    }
  },
});

// Query untuk mendapatkan semua order yang belum selesai
export const getPendingOrders = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders.filter(
      (o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled",
    );
  },
});

// Mutation untuk verifikasi pembayaran order
export const verifyOrderPayment = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      updatedAt: Date.now(),
    });

    const now = Date.now();
    const message = `Pembayaran untuk order ${order.productTitle} telah diverifikasi`;
    if (await allowNotification(ctx, order.buyerId, "order")) {
      await ctx.db.insert("notifications", {
        userId: order.buyerId,
        type: "order",
        message,
        url: `/marketplace/order/${order._id}`,
        read: false,
        createdAt: now,
      });
    }
    if (await allowNotification(ctx, order.sellerId, "order")) {
      await ctx.db.insert("notifications", {
        userId: order.sellerId,
        type: "order",
        message,
        url: `/marketplace/order/${order._id}`,
        read: false,
        createdAt: now,
      });
    }
  },
});

// Mutation untuk memperbarui status order
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    await ctx.db.patch(args.orderId, {
      orderStatus: args.status,
      ...(args.trackingNumber ? { trackingNumber: args.trackingNumber } : {}),
      updatedAt: Date.now(),
    });

    const now = Date.now();
    const statusMessage =
      args.status === "shipped"
        ? `Pesanan ${order.productTitle} telah dikirim`
        : args.status === "delivered"
          ? `Pesanan ${order.productTitle} telah selesai`
          : `Status pesanan ${order.productTitle} diperbarui menjadi ${args.status}`;

    if (await allowNotification(ctx, order.buyerId, "order")) {
      await ctx.db.insert("notifications", {
        userId: order.buyerId,
        type: "order",
        message: statusMessage,
        url: `/marketplace/order/${order._id}`,
        read: false,
        createdAt: now,
      });
    }
    if (await allowNotification(ctx, order.sellerId, "order")) {
      await ctx.db.insert("notifications", {
        userId: order.sellerId,
        type: "order",
        message: statusMessage,
        url: `/marketplace/order/${order._id}`,
        read: false,
        createdAt: now,
      });
    }
  },
});

// Mutation untuk upload bukti pembayaran
export const uploadPaymentProof = mutation({
  args: {
    orderId: v.id("orders"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order tidak ditemukan");
    }
    const url = await ctx.storage.getUrl(args.storageId);
    await ctx.db.patch(args.orderId, {
      paymentProofUrl: url,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk membuat review
export const createReview = mutation({
  args: {
    orderId: v.id("orders"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk memberi ulasan");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    if (order.buyerId !== user._id) {
      throw new Error("Anda bukan pembeli pesanan ini");
    }

    if (order.orderStatus !== "delivered") {
      throw new Error("Pesanan belum selesai");
    }

    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .unique();

    if (existing) {
      throw new Error("Ulasan sudah dibuat");
    }

    const now = Date.now();
    await ctx.db.insert("reviews", {
      orderId: args.orderId,
      productId: order.productId,
      reviewerId: user._id,
      reviewerName: user.name || "Anonymous",
      targetUserId: order.sellerId,
      targetUserName: order.sellerName,
      rating: args.rating,
      comment: args.comment,
      type: "seller",
      createdAt: now,
    });

    const newReviewCount = (user.reviewCount ?? 0) + 1;
    const badges = new Set(user.badges ?? []);
    if (newReviewCount >= 5) {
      badges.add("Terbanyak mengulas parfum");
    }
    await ctx.db.patch(user._id, {
      reviewCount: newReviewCount,
      badges: Array.from(badges),
      contributionPoints: (user.contributionPoints ?? 0) + 3,
    });

    const sellerProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", order.sellerId))
      .unique();
    let sellerRating = undefined;
    let sellerTotalReviews = undefined;
    if (sellerProfile) {
      sellerTotalReviews = (sellerProfile.totalReviews ?? 0) + 1;
      sellerRating =
        ((sellerProfile.rating ?? 0) * (sellerProfile.totalReviews ?? 0) +
          args.rating) /
        sellerTotalReviews;
      await ctx.db.patch(sellerProfile._id, {
        rating: sellerRating,
        totalReviews: sellerTotalReviews,
      });
    }

    const sellerUser = await ctx.db.get(order.sellerId);
    if (sellerUser) {
      const sellerBadges = new Set(sellerUser.badges ?? []);
      if (
        sellerRating !== undefined &&
        sellerTotalReviews !== undefined &&
        sellerRating >= 4.5 &&
        sellerTotalReviews >= 10
      ) {
        sellerBadges.add("Seller Terpercaya");
      }
      await ctx.db.patch(sellerUser._id, {
        badges: Array.from(sellerBadges),
        contributionPoints: (sellerUser.contributionPoints ?? 0) + 5,
      });
    }
  },
});

// Query untuk mendapatkan marketplace stats
export const getMarketplaceStats = query({
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    const activeProducts = allProducts.filter((p) => p.status === "active");
    const soldProducts = allProducts.filter((p) => p.status === "sold");
    const allOrders = await ctx.db.query("orders").collect();
    const completedOrders = allOrders.filter(
      (o) => o.orderStatus === "delivered",
    );

    return {
      totalProducts: allProducts.length,
      activeProducts: activeProducts.length,
      soldProducts: soldProducts.length,
      totalOrders: allOrders.length,
      completedOrders: completedOrders.length,
      totalValue: completedOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      ),
    };
  },
});

// Query untuk mendapatkan seller analytics
export const getSellerAnalytics = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId))
      .collect();

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId))
      .collect();

    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = products.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalSambats = products.reduce(
      (sum, p) => sum + (p.sambatCount || 0),
      0,
    );
    const completedOrders = orders.filter((o) => o.orderStatus === "delivered");
    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + o.totalAmount,
      0,
    );

    // Calculate monthly performance
    const now = Date.now();
    const lastMonth = now - 30 * 24 * 60 * 60 * 1000;
    const thisMonthOrders = orders.filter((o) => o.createdAt > lastMonth);
    const thisMonthRevenue = thisMonthOrders
      .filter((o) => o.orderStatus === "delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === "active").length,
      soldProducts: products.filter((p) => p.status === "sold").length,
      totalViews,
      totalLikes,
      totalSambats,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      thisMonthRevenue,
      averageRating: 4.8, // Placeholder - would calculate from reviews
      conversionRate:
        products.length > 0 ? (completedOrders.length / totalViews) * 100 : 0,
    };
  },
});

// Query untuk mendapatkan trending categories
export const getTrendingCategories = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categoryStats = products.reduce(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            category: product.category,
            count: 0,
            totalViews: 0,
            totalLikes: 0,
          };
        }
        acc[product.category].count++;
        acc[product.category].totalViews += product.views || 0;
        acc[product.category].totalLikes += product.likes || 0;
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(categoryStats)
      .sort((a: any, b: any) => b.totalViews - a.totalViews)
      .slice(0, 5);
  },
});

// Query untuk mendapatkan recommended pricing
export const getRecommendedPricing = query({
  args: { category: v.string(), condition: v.string() },
  handler: async (ctx, args) => {
    const similarProducts = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("condition"), args.condition))
      .collect();

    if (similarProducts.length === 0) {
      return { min: 0, max: 0, average: 0, count: 0 };
    }

    const prices = similarProducts.map((p) => p.price).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const average =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return {
      min,
      max,
      average: Math.round(average),
      count: similarProducts.length,
    };
  },
});

// ===== SAMBAT QUERIES & MUTATIONS =====

// Query untuk mendapatkan semua produk sambat
export const getSambatProducts = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db.query("sambatProducts");

    // Sorting
    if (args.sortBy === "price_low") {
      query = ctx.db
        .query("sambatProducts")
        .withIndex("by_created_at")
        .order("asc");
    } else if (args.sortBy === "price_high") {
      query = ctx.db
        .query("sambatProducts")
        .withIndex("by_created_at")
        .order("desc");
    } else if (args.sortBy === "popular") {
      query = ctx.db
        .query("sambatProducts")
        .withIndex("by_views")
        .order("desc");
    } else if (args.sortBy === "liked") {
      query = ctx.db
        .query("sambatProducts")
        .withIndex("by_likes")
        .order("desc");
    } else if (args.sortBy === "deadline") {
      query = ctx.db
        .query("sambatProducts")
        .withIndex("by_deadline")
        .order("asc");
    } else {
      query = ctx.db
        .query("sambatProducts")
        .withIndex("by_created_at")
        .order("desc");
    }

    const products = await query.paginate(args.paginationOpts);

    // Filter berdasarkan kriteria
    let filteredProducts = products.page;

    if (args.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === args.status,
      );
    } else {
      // Default hanya tampilkan yang active
      filteredProducts = filteredProducts.filter(
        (product) => product.status === "active",
      );
    }

    if (args.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === args.category,
      );
    }

    if (args.location) {
      filteredProducts = filteredProducts.filter((product) =>
        product.location.toLowerCase().includes(args.location!.toLowerCase()),
      );
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    return {
      ...products,
      page: filteredProducts,
    };
  },
});

// Query untuk mendapatkan produk sambat berdasarkan ID
export const getSambatProductById = query({
  args: { sambatProductId: v.id("sambatProducts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sambatProductId);
  },
});

// Query untuk mendapatkan enrollments berdasarkan produk sambat
export const getSambatEnrollments = query({
  args: { sambatProductId: v.id("sambatProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sambatEnrollments")
      .withIndex("by_sambat_product", (q) =>
        q.eq("sambatProductId", args.sambatProductId),
      )
      .order("desc")
      .collect();
  },
});

// Query untuk cek apakah user sudah enroll
export const hasUserEnrolledSambat = query({
  args: { sambatProductId: v.id("sambatProducts"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("sambatEnrollments")
      .withIndex("by_sambat_product", (q) =>
        q.eq("sambatProductId", args.sambatProductId),
      )
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
    return enrollment;
  },
});

// Query untuk cek apakah user sudah like produk sambat
export const hasUserLikedSambatProduct = query({
  args: { sambatProductId: v.id("sambatProducts"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("sambatProductLikes")
      .withIndex("by_sambat_product_user", (q) =>
        q.eq("sambatProductId", args.sambatProductId).eq("userId", args.userId),
      )
      .unique();
    return !!like;
  },
});

// Mutation untuk membuat produk sambat
export const createSambatProduct = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    brand: v.string(),
    category: v.string(),
    originalPrice: v.number(),
    pricePerPortion: v.number(),
    totalPortions: v.number(),
    minParticipants: v.number(),
    maxParticipants: v.number(),
    images: v.array(v.string()),
    location: v.string(),
    shippingOptions: v.array(v.string()),
    tags: v.array(v.string()),
    deadline: v.number(),
    portionSize: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk membuat sambatan");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const now = Date.now();

    return await ctx.db.insert("sambatProducts", {
      title: args.title,
      description: args.description,
      brand: args.brand,
      category: args.category,
      originalPrice: args.originalPrice,
      pricePerPortion: args.pricePerPortion,
      totalPortions: args.totalPortions,
      minParticipants: args.minParticipants,
      maxParticipants: args.maxParticipants,
      currentParticipants: 0,
      images: args.images,
      sellerId: user._id,
      sellerName: user.name || "Anonymous",
      status: "active",
      location: args.location,
      shippingOptions: args.shippingOptions,
      tags: args.tags,
      views: 0,
      likes: 0,
      deadline: args.deadline,
      portionSize: args.portionSize,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation untuk enroll ke sambatan
export const enrollSambat = mutation({
  args: {
    sambatProductId: v.id("sambatProducts"),
    portionsRequested: v.number(),
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
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk ikut sambatan");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const sambatProduct = await ctx.db.get(args.sambatProductId);
    if (!sambatProduct) {
      throw new Error("Produk sambatan tidak ditemukan");
    }

    if (sambatProduct.status !== "active") {
      throw new Error("Sambatan sudah tidak aktif");
    }

    if (sambatProduct.sellerId === user._id) {
      throw new Error("Anda tidak bisa ikut sambatan produk sendiri");
    }

    // Cek apakah sudah enroll sebelumnya
    const existingEnrollment = await ctx.db
      .query("sambatEnrollments")
      .withIndex("by_sambat_product", (q) =>
        q.eq("sambatProductId", args.sambatProductId),
      )
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (existingEnrollment) {
      throw new Error("Anda sudah terdaftar dalam sambatan ini");
    }

    // Cek apakah masih ada slot
    const totalPortionsAfter =
      sambatProduct.currentParticipants + args.portionsRequested;
    if (totalPortionsAfter > sambatProduct.maxParticipants) {
      throw new Error("Jumlah porsi yang diminta melebihi slot yang tersedia");
    }

    // Cek deadline
    if (Date.now() > sambatProduct.deadline) {
      throw new Error("Deadline sambatan sudah berakhir");
    }

    const now = Date.now();
    const totalAmount =
      args.portionsRequested * sambatProduct.pricePerPortion +
      args.shippingCost;

    // Generate virtual account number
    const vaNumber = `8809${Date.now().toString().slice(-8)}`;
    const paymentExpiry = now + 24 * 60 * 60 * 1000; // 24 jam

    const enrollmentId = await ctx.db.insert("sambatEnrollments", {
      sambatProductId: args.sambatProductId,
      userId: user._id,
      userName: user.name || "Anonymous",
      portionsRequested: args.portionsRequested,
      totalAmount,
      paymentStatus: "pending",
      shippingAddress: args.shippingAddress,
      origin: args.origin,
      destination: args.destination,
      shippingMethod: args.shippingMethod,
      shippingCost: args.shippingCost,
      virtualAccountNumber: vaNumber,
      paymentExpiry,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Update current participants
    await ctx.db.patch(args.sambatProductId, {
      currentParticipants: totalPortionsAfter,
      updatedAt: now,
    });

    // Cek apakah sudah penuh
    if (totalPortionsAfter >= sambatProduct.maxParticipants) {
      await ctx.db.patch(args.sambatProductId, {
        status: "full",
        updatedAt: now,
      });
    }

    return enrollmentId;
  },
});

// Mutation untuk update payment status sambat
export const updateSambatPaymentStatus = mutation({
  args: {
    enrollmentId: v.id("sambatEnrollments"),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) {
      throw new Error("Enrollment tidak ditemukan");
    }

    await ctx.db.patch(args.enrollmentId, {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    });

    // Jika payment failed, kurangi current participants
    if (args.paymentStatus === "failed") {
      const sambatProduct = await ctx.db.get(enrollment.sambatProductId);
      if (sambatProduct) {
        const newParticipants = Math.max(
          0,
          sambatProduct.currentParticipants - enrollment.portionsRequested,
        );
        await ctx.db.patch(enrollment.sambatProductId, {
          currentParticipants: newParticipants,
          status:
            newParticipants < sambatProduct.maxParticipants ? "active" : "full",
          updatedAt: Date.now(),
        });
      }
    }
  },
});

// Mutation untuk like/unlike produk sambat
export const toggleSambatProductLike = mutation({
  args: { sambatProductId: v.id("sambatProducts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk like produk");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const existingLike = await ctx.db
      .query("sambatProductLikes")
      .withIndex("by_sambat_product_user", (q) =>
        q.eq("sambatProductId", args.sambatProductId).eq("userId", user._id),
      )
      .unique();

    const product = await ctx.db.get(args.sambatProductId);
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.sambatProductId, {
        likes: Math.max(0, product.likes - 1),
        updatedAt: Date.now(),
      });
      return false;
    } else {
      await ctx.db.insert("sambatProductLikes", {
        sambatProductId: args.sambatProductId,
        userId: user._id,
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.sambatProductId, {
        likes: product.likes + 1,
        updatedAt: Date.now(),
      });
      return true;
    }
  },
});

// Mutation untuk increment view count sambat
export const incrementSambatProductViews = mutation({
  args: { sambatProductId: v.id("sambatProducts") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.sambatProductId);
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    await ctx.db.patch(args.sambatProductId, {
      views: product.views + 1,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk like/unlike brand
export const toggleBrandLike = mutation({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk like brand");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const existingLike = await ctx.db
      .query("brandLikes")
      .withIndex("by_brand_user", (q) =>
        q.eq("brandId", args.brandId).eq("userId", user._id),
      )
      .unique();

    const brand = await ctx.db.get(args.brandId);
    if (!brand) {
      throw new Error("Brand tidak ditemukan");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.brandId, {
        likes: Math.max(0, brand.likes - 1),
        updatedAt: Date.now(),
      });
      return false;
    } else {
      await ctx.db.insert("brandLikes", {
        brandId: args.brandId,
        userId: user._id,
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.brandId, {
        likes: brand.likes + 1,
        updatedAt: Date.now(),
      });
      return true;
    }
  },
});

// Mutation untuk increment view count brand
export const incrementBrandViews = mutation({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const brand = await ctx.db.get(args.brandId);
    if (!brand) {
      throw new Error("Brand tidak ditemukan");
    }

    await ctx.db.patch(args.brandId, {
      views: brand.views + 1,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk like/unlike fragrance
export const toggleFragranceLike = mutation({
  args: { fragranceId: v.id("fragrances") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk like parfum");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const existingLike = await ctx.db
      .query("fragranceLikes")
      .withIndex("by_fragrance_user", (q) =>
        q.eq("fragranceId", args.fragranceId).eq("userId", user._id),
      )
      .unique();

    const fragrance = await ctx.db.get(args.fragranceId);
    if (!fragrance) {
      throw new Error("Parfum tidak ditemukan");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.fragranceId, {
        totalLikes: Math.max(0, fragrance.totalLikes - 1),
        updatedAt: Date.now(),
      });
      return false;
    } else {
      await ctx.db.insert("fragranceLikes", {
        fragranceId: args.fragranceId,
        userId: user._id,
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.fragranceId, {
        totalLikes: fragrance.totalLikes + 1,
        updatedAt: Date.now(),
      });
      return true;
    }
  },
});

// Mutation untuk menambah suara bermanfaat pada review
export const voteReviewHelpful = mutation({
  args: { reviewId: v.id("fragranceReviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Anda harus login untuk menandai bermanfaat");
    }

    const voter = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!voter) {
      throw new Error("User tidak ditemukan");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error("Review tidak ditemukan");
    }

    await ctx.db.patch(args.reviewId, {
      helpfulVotes: review.helpfulVotes + 1,
    });

    const author = await ctx.db.get(review.userId);
    if (author) {
      const newHelpful = (author.helpfulCount ?? 0) + 1;
      const badges = new Set(author.badges ?? []);
      if (newHelpful >= 10) {
        badges.add("Paling sering membantu");
      }
      await ctx.db.patch(author._id, {
        helpfulCount: newHelpful,
        badges: Array.from(badges),
      });
    }

    return true;
  },
});

// Mutation untuk increment view count fragrance
export const incrementFragranceViews = mutation({
  args: { fragranceId: v.id("fragrances") },
  handler: async (ctx, args) => {
    const fragrance = await ctx.db.get(args.fragranceId);
    if (!fragrance) {
      throw new Error("Parfum tidak ditemukan");
    }

    await ctx.db.patch(args.fragranceId, {
      views: fragrance.views + 1,
      updatedAt: Date.now(),
    });
  },
});

// ===== DATABASE QUERIES =====

// Query untuk mendapatkan semua brand Indonesia
export const getIndonesianBrands = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db
      .query("brands")
      .withIndex("by_country", (q) => q.eq("country", "Indonesia"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"));

    // Sorting
    if (args.sortBy === "rating") {
      query = ctx.db
        .query("brands")
        .withIndex("by_rating")
        .order("desc")
        .filter((q) => q.eq(q.field("country"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    } else if (args.sortBy === "popular") {
      query = ctx.db
        .query("brands")
        .withIndex("by_views")
        .order("desc")
        .filter((q) => q.eq(q.field("country"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    } else if (args.sortBy === "liked") {
      query = ctx.db
        .query("brands")
        .withIndex("by_likes")
        .order("desc")
        .filter((q) => q.eq(q.field("country"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    } else if (args.sortBy === "name") {
      query = ctx.db
        .query("brands")
        .withIndex("by_created_at")
        .order("asc")
        .filter((q) => q.eq(q.field("country"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    } else {
      query = ctx.db
        .query("brands")
        .withIndex("by_created_at")
        .order("desc")
        .filter((q) => q.eq(q.field("country"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    }

    const brands = await query.paginate(args.paginationOpts);

    // Filter berdasarkan kriteria
    let filteredBrands = brands.page;

    if (args.category) {
      filteredBrands = filteredBrands.filter(
        (brand) => brand.category === args.category,
      );
    }

    if (args.city) {
      filteredBrands = filteredBrands.filter((brand) =>
        brand.city?.toLowerCase().includes(args.city!.toLowerCase()),
      );
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      filteredBrands = filteredBrands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchLower) ||
          brand.description.toLowerCase().includes(searchLower) ||
          brand.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    return {
      ...brands,
      page: filteredBrands,
    };
  },
});

// Query untuk mendapatkan semua perfumer Indonesia
export const getIndonesianPerfumers = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    experience: v.optional(v.string()),
    specialty: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db
      .query("perfumers")
      .withIndex("by_nationality", (q) => q.eq("nationality", "Indonesia"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"));

    // Sorting
    if (args.sortBy === "rating") {
      query = ctx.db
        .query("perfumers")
        .withIndex("by_rating")
        .order("desc")
        .filter((q) => q.eq(q.field("nationality"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    } else if (args.sortBy === "experience") {
      query = ctx.db
        .query("perfumers")
        .withIndex("by_experience")
        .order("desc")
        .filter((q) => q.eq(q.field("nationality"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    } else {
      query = ctx.db
        .query("perfumers")
        .withIndex("by_created_at")
        .order("desc")
        .filter((q) => q.eq(q.field("nationality"), "Indonesia"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .filter((q) => q.eq(q.field("verificationStatus"), "approved"));
    }

    const perfumers = await query.paginate(args.paginationOpts);

    // Filter berdasarkan kriteria
    let filteredPerfumers = perfumers.page;

    if (args.experience) {
      filteredPerfumers = filteredPerfumers.filter(
        (perfumer) => perfumer.experience === args.experience,
      );
    }

    if (args.specialty) {
      filteredPerfumers = filteredPerfumers.filter((perfumer) =>
        perfumer.specialties.includes(args.specialty!),
      );
    }

    if (args.city) {
      filteredPerfumers = filteredPerfumers.filter((perfumer) =>
        perfumer.city?.toLowerCase().includes(args.city!.toLowerCase()),
      );
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      filteredPerfumers = filteredPerfumers.filter(
        (perfumer) =>
          perfumer.name.toLowerCase().includes(searchLower) ||
          perfumer.bio.toLowerCase().includes(searchLower) ||
          perfumer.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchLower),
          ) ||
          perfumer.brandsWorkedWith.some((brand) =>
            brand.toLowerCase().includes(searchLower),
          ),
      );
    }

    return {
      ...perfumers,
      page: filteredPerfumers,
    };
  },
});

// Query untuk mendapatkan semua parfum Indonesia
export const getIndonesianFragrances = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    category: v.optional(v.string()),
    concentration: v.optional(v.string()),
    gender: v.optional(v.string()),
    brandId: v.optional(v.id("brands")),
    perfumerId: v.optional(v.id("perfumers")),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db
      .query("fragrances")
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"));

    // Filter by brand first if specified
    if (args.brandId) {
      query = query.withIndex("by_brand", (q) => q.eq("brandId", args.brandId));
    } else if (args.perfumerId) {
      query = query.withIndex("by_perfumer", (q) =>
        q.eq("perfumerId", args.perfumerId),
      );
    } else {
      // Sorting
      if (args.sortBy === "rating") {
        query = query.withIndex("by_rating").order("desc");
      } else if (args.sortBy === "popular") {
        query = query.withIndex("by_views").order("desc");
      } else if (args.sortBy === "liked") {
        query = query.withIndex("by_likes").order("desc");
      } else {
        query = query.withIndex("by_created_at").order("desc");
      }
    }

    const fragrances = await query.paginate(args.paginationOpts);

    // Filter untuk hanya parfum dari brand Indonesia
    const indonesianBrands = await ctx.db
      .query("brands")
      .withIndex("by_country", (q) => q.eq("country", "Indonesia"))
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();
    const indonesianBrandIds = new Set(indonesianBrands.map((b) => b._id));

    let filteredFragrances = fragrances.page.filter((fragrance) =>
      indonesianBrandIds.has(fragrance.brandId),
    );

    // Filter berdasarkan kriteria
    if (args.category) {
      filteredFragrances = filteredFragrances.filter(
        (fragrance) => fragrance.category === args.category,
      );
    }

    if (args.concentration) {
      filteredFragrances = filteredFragrances.filter(
        (fragrance) => fragrance.concentration === args.concentration,
      );
    }

    if (args.gender) {
      filteredFragrances = filteredFragrances.filter(
        (fragrance) => fragrance.gender === args.gender,
      );
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      filteredFragrances = filteredFragrances.filter(
        (fragrance) =>
          fragrance.name.toLowerCase().includes(searchLower) ||
          fragrance.description.toLowerCase().includes(searchLower) ||
          fragrance.brandName.toLowerCase().includes(searchLower) ||
          fragrance.perfumerName?.toLowerCase().includes(searchLower) ||
          fragrance.topNotes.some((note) =>
            note.toLowerCase().includes(searchLower),
          ) ||
          fragrance.middleNotes.some((note) =>
            note.toLowerCase().includes(searchLower),
          ) ||
          fragrance.baseNotes.some((note) =>
            note.toLowerCase().includes(searchLower),
          ) ||
          fragrance.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    return {
      ...fragrances,
      page: filteredFragrances,
    };
  },
});

// Query untuk mendapatkan statistik database
export const getDatabaseStats = query({
  handler: async (ctx) => {
    const indonesianBrands = await ctx.db
      .query("brands")
      .withIndex("by_country", (q) => q.eq("country", "Indonesia"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();

    const indonesianPerfumers = await ctx.db
      .query("perfumers")
      .withIndex("by_nationality", (q) => q.eq("nationality", "Indonesia"))
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();

    const indonesianBrandIds = new Set(indonesianBrands.map((b) => b._id));
    const allFragrances = await ctx.db
      .query("fragrances")
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();
    const indonesianFragrances = allFragrances.filter((f) =>
      indonesianBrandIds.has(f.brandId),
    );

    return {
      totalBrands: indonesianBrands.length,
      totalPerfumers: indonesianPerfumers.length,
      totalFragrances: indonesianFragrances.length,
      activeBrands: indonesianBrands.filter((b) => b.isActive).length,
      activePerfumers: indonesianPerfumers.filter((p) => p.isActive).length,
      averageBrandRating:
        indonesianBrands.reduce((sum, b) => sum + b.rating, 0) /
        indonesianBrands.length,
      averagePerfumerRating:
        indonesianPerfumers.reduce((sum, p) => sum + p.rating, 0) /
        indonesianPerfumers.length,
      averageFragranceRating:
        indonesianFragrances.reduce((sum, f) => sum + f.rating, 0) /
        indonesianFragrances.length,
    };
  },
});

// Mutation untuk menginisialisasi data sample
export const initializeSampleData = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    // Sample Indonesian Brands
    const sampleBrands = [
      {
        name: "Wardah",
        description: "Brand kosmetik dan parfum halal terkemuka di Indonesia",
        logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&q=80",
        website: "https://wardahbeauty.com",
        country: "Indonesia",
        city: "Jakarta",
        foundedYear: 1995,
        category: "Commercial",
        isActive: true,
        verificationStatus: "approved",
        totalProducts: 25,
        rating: 4.2,
        totalReviews: 1250,
        views: 0,
        likes: 0,
        tags: ["Halal", "Local", "Affordable"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Mustika Ratu",
        description:
          "Brand kecantikan tradisional Indonesia dengan warisan budaya",
        logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80",
        website: "https://www.mustika-ratu.co.id",
        country: "Indonesia",
        city: "Jakarta",
        foundedYear: 1978,
        category: "Commercial",
        isActive: true,
        verificationStatus: "approved",
        totalProducts: 18,
        rating: 4.0,
        totalReviews: 890,
        views: 0,
        likes: 0,
        tags: ["Traditional", "Heritage", "Natural"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Kahf",
        description: "Brand grooming halal untuk pria modern Indonesia",
        logo: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80",
        website: "https://kahf.co.id",
        country: "Indonesia",
        city: "Jakarta",
        foundedYear: 2019,
        category: "Commercial",
        isActive: true,
        verificationStatus: "approved",
        totalProducts: 12,
        rating: 4.5,
        totalReviews: 567,
        views: 0,
        likes: 0,
        tags: ["Halal", "Men", "Modern"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Sensatia Botanicals",
        description: "Brand natural skincare dan parfum artisan dari Bali",
        logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
        website: "https://sensatiabotanicals.com",
        country: "Indonesia",
        city: "Bali",
        foundedYear: 2008,
        category: "Artisan",
        isActive: true,
        verificationStatus: "approved",
        totalProducts: 8,
        rating: 4.7,
        totalReviews: 234,
        views: 0,
        likes: 0,
        tags: ["Natural", "Artisan", "Bali"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Sample Indonesian Perfumers
    const samplePerfumers = [
      {
        name: "Andi Suherman",
        bio: "Perfumer berpengalaman dengan spesialisasi aroma oriental dan woody. Telah menciptakan lebih dari 50 formula parfum untuk berbagai brand lokal.",
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
        nationality: "Indonesia",
        city: "Jakarta",
        birthYear: 1975,
        education: "Grasse Institute of Perfumery, France",
        experience: "Expert",
        specialties: ["Oriental", "Woody", "Spicy"],
        brandsWorkedWith: ["Wardah", "Mustika Ratu"],
        achievements: [
          "Best Indonesian Perfumer 2020",
          "Fragrance Innovation Award 2019",
        ],
        socialMedia: {
          instagram: "@andisuherman_perfumer",
          website: "https://andisuherman.com",
        },
        isActive: true,
        verificationStatus: "approved",
        totalCreations: 52,
        rating: 4.6,
        totalReviews: 89,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Sari Dewi Kusuma",
        bio: "Perfumer muda berbakat yang fokus pada aroma floral dan fresh. Lulusan terbaik dari program perfumery di Singapura.",
        photo:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&q=80",
        nationality: "Indonesia",
        city: "Bandung",
        birthYear: 1988,
        education: "Singapore Perfumery Institute",
        experience: "Intermediate",
        specialties: ["Floral", "Fresh", "Citrus"],
        brandsWorkedWith: ["Kahf", "Sensatia Botanicals"],
        achievements: ["Young Perfumer Award 2021"],
        socialMedia: {
          instagram: "@saridewi_scents",
        },
        isActive: true,
        verificationStatus: "approved",
        totalCreations: 28,
        rating: 4.4,
        totalReviews: 45,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Insert brands
    const brandIds = [];
    for (const brand of sampleBrands) {
      const brandId = await ctx.db.insert("brands", brand);
      brandIds.push(brandId);
    }

    // Insert perfumers
    const perfumerIds = [];
    for (const perfumer of samplePerfumers) {
      const perfumerId = await ctx.db.insert("perfumers", perfumer);
      perfumerIds.push(perfumerId);
    }

    // Sample Fragrances
    const sampleFragrances = [
      {
        name: "Wardah Exclusive Musk",
        brandId: brandIds[0],
        brandName: "Wardah",
        perfumerId: perfumerIds[0],
        perfumerName: "Andi Suherman",
        description:
          "Parfum musk yang elegan dengan sentuhan oriental yang memikat",
        images: [
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
        ],
        category: "Oriental",
        concentration: "EDP",
        topNotes: ["Bergamot", "Pink Pepper", "Cardamom"],
        middleNotes: ["Rose", "Jasmine", "White Musk"],
        baseNotes: ["Sandalwood", "Amber", "Vanilla"],
        sillage: "Moderate",
        longevity: "Long Lasting",
        season: ["Fall", "Winter"],
        occasion: ["Evening", "Special"],
        gender: "Unisex",
        launchYear: 2022,
        price: 150000,
        sizes: ["30ml", "50ml"],
        isDiscontinued: false,
        verificationStatus: "approved",
        rating: 4.3,
        totalReviews: 156,
        totalLikes: 89,
        views: 1234,
        tags: ["Musk", "Oriental", "Elegant"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Mustika Ratu Sari Bunga",
        brandId: brandIds[1],
        brandName: "Mustika Ratu",
        perfumerId: perfumerIds[1],
        perfumerName: "Sari Dewi Kusuma",
        description:
          "Parfum floral tradisional dengan aroma bunga-bunga nusantara",
        images: [
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&q=80",
        ],
        category: "Floral",
        concentration: "EDT",
        topNotes: ["Frangipani", "Ylang-Ylang", "Lemon"],
        middleNotes: ["Jasmine", "Rose", "Tuberose"],
        baseNotes: ["Sandalwood", "White Musk", "Cedar"],
        sillage: "Light",
        longevity: "Moderate",
        season: ["Spring", "Summer"],
        occasion: ["Daily", "Office"],
        gender: "Women",
        launchYear: 2021,
        price: 120000,
        sizes: ["30ml", "50ml", "100ml"],
        isDiscontinued: false,
        verificationStatus: "approved",
        rating: 4.1,
        totalReviews: 203,
        totalLikes: 145,
        views: 2156,
        tags: ["Floral", "Traditional", "Indonesian"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Kahf Signature Oud",
        brandId: brandIds[2],
        brandName: "Kahf",
        perfumerId: perfumerIds[0],
        perfumerName: "Andi Suherman",
        description:
          "Parfum oud modern untuk pria dengan karakter maskulin yang kuat",
        images: [
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
        ],
        category: "Woody",
        concentration: "EDP",
        topNotes: ["Bergamot", "Black Pepper", "Cardamom"],
        middleNotes: ["Oud", "Rose", "Saffron"],
        baseNotes: ["Sandalwood", "Amber", "Musk"],
        sillage: "Heavy",
        longevity: "Long Lasting",
        season: ["Fall", "Winter"],
        occasion: ["Evening", "Special"],
        gender: "Men",
        launchYear: 2023,
        price: 200000,
        sizes: ["50ml", "100ml"],
        isDiscontinued: false,
        verificationStatus: "approved",
        rating: 4.5,
        totalReviews: 98,
        totalLikes: 67,
        views: 876,
        tags: ["Oud", "Masculine", "Luxury"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Insert fragrances
    for (const fragrance of sampleFragrances) {
      await ctx.db.insert("fragrances", fragrance);
    }

    return {
      message: "Sample data berhasil diinisialisasi",
      brands: sampleBrands.length,
      perfumers: samplePerfumers.length,
      fragrances: sampleFragrances.length,
    };
  },
});

// ===== VERIFICATION =====

export const submitVerificationRequest = mutation({
  args: { itemType: v.string(), itemId: v.string() },
  handler: async (ctx, args) => {
    const table =
      args.itemType === "brand"
        ? "brands"
        : args.itemType === "perfumer"
          ? "perfumers"
          : args.itemType === "fragrance"
            ? "fragrances"
            : null;
    if (!table) throw new Error("Invalid item type");
    await ctx.db.patch(args.itemId as any, {
      verificationStatus: "pending",
    });
  },
});

export const moderateVerificationRequest = mutation({
  args: { itemType: v.string(), itemId: v.string(), approve: v.boolean() },
  handler: async (ctx, args) => {
    const table =
      args.itemType === "brand"
        ? "brands"
        : args.itemType === "perfumer"
          ? "perfumers"
          : args.itemType === "fragrance"
            ? "fragrances"
            : null;
    if (!table) throw new Error("Invalid item type");
    await ctx.db.patch(args.itemId as any, {
      verificationStatus: args.approve ? "approved" : "rejected",
    });
  },
});

// ===== SUGGESTIONS & BUG REPORTS =====

// Query untuk mendapatkan semua saran dan laporan bug
export const getSuggestions = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query: any = ctx.db
      .query("suggestions")
      .withIndex("by_created_at")
      .order("desc");

    const suggestions = await query.paginate(args.paginationOpts);

    // Filter berdasarkan kriteria
    let filteredSuggestions = suggestions.page;

    if (args.type) {
      filteredSuggestions = filteredSuggestions.filter(
        (suggestion) => suggestion.type === args.type,
      );
    }

    if (args.status) {
      filteredSuggestions = filteredSuggestions.filter(
        (suggestion) => suggestion.status === args.status,
      );
    }

    if (args.priority) {
      filteredSuggestions = filteredSuggestions.filter(
        (suggestion) => suggestion.priority === args.priority,
      );
    }

    return {
      ...suggestions,
      page: filteredSuggestions,
    };
  },
});

// Query untuk mendapatkan saran berdasarkan ID
export const getSuggestionById = query({
  args: { suggestionId: v.id("suggestions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.suggestionId);
  },
});

// Query untuk mendapatkan statistik saran dan laporan bug
export const getSuggestionStats = query({
  handler: async (ctx) => {
    const allSuggestions = await ctx.db.query("suggestions").collect();

    const suggestions = allSuggestions.filter((s) => s.type === "suggestion");
    const bugReports = allSuggestions.filter((s) => s.type === "bug_report");
    const pending = allSuggestions.filter((s) => s.status === "pending");
    const resolved = allSuggestions.filter((s) => s.status === "resolved");
    const urgent = allSuggestions.filter((s) => s.priority === "urgent");

    return {
      total: allSuggestions.length,
      suggestions: suggestions.length,
      bugReports: bugReports.length,
      pending: pending.length,
      resolved: resolved.length,
      urgent: urgent.length,
    };
  },
});

// Mutation untuk membuat saran atau laporan bug
export const createSuggestion = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    type: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
        .unique();

      if (user) {
        userId = user._id;
      }
    }

    const now = Date.now();

    return await ctx.db.insert("suggestions", {
      name: args.name,
      email: args.email,
      type: args.type,
      subject: args.subject,
      message: args.message,
      status: "pending",
      priority: "medium",
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation untuk update status saran
export const updateSuggestionStatus = mutation({
  args: {
    suggestionId: v.id("suggestions"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Saran tidak ditemukan");
    }

    await ctx.db.patch(args.suggestionId, {
      status: args.status,
      adminNotes: args.adminNotes,
      updatedAt: Date.now(),
    });
  },
});

// Mutation untuk update prioritas saran
export const updateSuggestionPriority = mutation({
  args: {
    suggestionId: v.id("suggestions"),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Saran tidak ditemukan");
    }

    await ctx.db.patch(args.suggestionId, {
      priority: args.priority,
      updatedAt: Date.now(),
    });
  },
});

// Action untuk mendapatkan URL upload ke storage
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const calculateShippingCost = action({
  args: {
    origin: v.string(),
    destination: v.string(),
    courier: v.string(),
    weight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const key = process.env.RAJAONGKIR_API_KEY;
    if (!key) {
      throw new Error("Missing RajaOngkir API key");
    }
    const res = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key,
      },
      body: JSON.stringify({
        origin: args.origin,
        destination: args.destination,
        weight: args.weight ?? 1000,
        courier: args.courier,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch cost: ${res.status} ${text}`);
    }
    const data = await res.json();
    try {
      return data.rajaongkir.results[0].costs[0].cost[0].value as number;
    } catch (_) {
      throw new Error("Invalid response from RajaOngkir");
    }
  },
});
