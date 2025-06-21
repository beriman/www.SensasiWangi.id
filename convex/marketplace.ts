import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query untuk mendapatkan semua produk dengan pagination
export const getProducts = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.optional(v.union(v.string(), v.null())),
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
    let query = ctx.db
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

    const now = Date.now();

    return await ctx.db.insert("products", {
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
      createdAt: now,
      updatedAt: now,
    });
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

    if (product.sellerId === user._id) {
      throw new Error("Anda tidak bisa membeli produk sendiri");
    }

    const seller = await ctx.db.get(product.sellerId);
    if (!seller) {
      throw new Error("Penjual tidak ditemukan");
    }

    const now = Date.now();
    const totalAmount = product.price + args.shippingCost;

    // Generate virtual account number (simulasi)
    const vaNumber = `8808${Date.now().toString().slice(-8)}`;
    const paymentExpiry = now + 24 * 60 * 60 * 1000; // 24 jam

    const orderId = await ctx.db.insert("orders", {
      productId: args.productId,
      buyerId: user._id,
      sellerId: product.sellerId,
      buyerName: user.name || "Anonymous",
      sellerName: seller.name || "Anonymous",
      productTitle: product.title,
      price: product.price,
      shippingAddress: args.shippingAddress,
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

    // Update status produk menjadi sold (sementara pending)
    await ctx.db.patch(args.productId, {
      status: "sold",
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

    // Jika payment failed, kembalikan status produk ke active
    if (args.paymentStatus === "failed") {
      await ctx.db.patch(order.productId, {
        status: "active",
        updatedAt: Date.now(),
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

// ===== SAMBAT QUERIES & MUTATIONS =====

// Query untuk mendapatkan semua produk sambat
export const getSambatProducts = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.optional(v.union(v.string(), v.null())),
    }),
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("sambatProducts");

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

// ===== SUGGESTIONS & BUG REPORTS =====

// Query untuk mendapatkan semua saran dan laporan bug
export const getSuggestions = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.optional(v.union(v.string(), v.null())),
    }),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
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
