var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  advertisements: () => advertisements,
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  carts: () => carts,
  cartsRelations: () => cartsRelations,
  categories: () => categories,
  insertAdvertisementSchema: () => insertAdvertisementSchema,
  insertCartItemSchema: () => insertCartItemSchema,
  insertCartSchema: () => insertCartSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPaymentMethodSchema: () => insertPaymentMethodSchema,
  insertProductSchema: () => insertProductSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertStoreSchema: () => insertStoreSchema,
  insertSupportMessageSchema: () => insertSupportMessageSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertUserSchema: () => insertUserSchema,
  insertWishlistSchema: () => insertWishlistSchema,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  paymentMethods: () => paymentMethods,
  products: () => products,
  productsRelations: () => productsRelations,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  storeAnalytics: () => storeAnalytics,
  storeAnalyticsRelations: () => storeAnalyticsRelations,
  stores: () => stores,
  storesRelations: () => storesRelations,
  supportMessages: () => supportMessages,
  supportMessagesRelations: () => supportMessagesRelations,
  supportTickets: () => supportTickets,
  supportTicketsRelations: () => supportTicketsRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  wishlists: () => wishlists,
  wishlistsRelations: () => wishlistsRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  phone: text("phone"),
  role: text("role").default("user").notNull(),
  // "user", "vendor", "admin"
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  // إضافة حقول التكامل مع وسائل التواصل الاجتماعي
  googleId: text("google_id").unique(),
  facebookId: text("facebook_id").unique(),
  twitterId: text("twitter_id").unique(),
  // معلومات لاشتراكات المستخدم
  loyaltyPoints: integer("loyalty_points").default(0),
  membershipTier: text("membership_tier").default("standard")
  // standard, silver, gold, platinum
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatar: true,
  phone: true
});
var stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo"),
  coverImage: text("cover_image"),
  category: text("category").notNull(),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  rating: doublePrecision("rating").default(0),
  productCount: integer("product_count").default(0)
});
var insertStoreSchema = createInsertSchema(stores).pick({
  userId: true,
  name: true,
  description: true,
  logo: true,
  coverImage: true,
  category: true
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  // يمكن إضافة صور إضافية للمنتج
  additionalImages: text("additional_images").array(),
  price: doublePrecision("price").notNull(),
  oldPrice: doublePrecision("old_price"),
  category: text("category").notNull(),
  // إضافة حقول للمخزون وإدارته
  sku: text("sku"),
  // رمز تعريف المنتج
  quantity: integer("quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  isInStock: boolean("is_in_stock").default(true),
  // بيانات المنتج الأخرى
  rating: doublePrecision("rating").default(0),
  salesCount: integer("sales_count").default(0),
  isNew: boolean("is_new").default(false),
  hasDiscount: boolean("has_discount").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  // معلومات تسويقية إضافية
  tags: text("tags").array(),
  weight: doublePrecision("weight"),
  dimensions: text("dimensions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});
var insertProductSchema = createInsertSchema(products).pick({
  storeId: true,
  name: true,
  description: true,
  image: true,
  additionalImages: true,
  price: true,
  oldPrice: true,
  category: true,
  sku: true,
  quantity: true,
  lowStockThreshold: true,
  isInStock: true,
  isNew: true,
  hasDiscount: true,
  isBestseller: true,
  tags: true,
  weight: true,
  dimensions: true
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  // إضافة حقول للسماح للبائعين بالرد على المراجعات
  isReplied: boolean("is_replied").default(false),
  replyContent: text("reply_content"),
  replyCreatedAt: timestamp("reply_created_at"),
  // حقول إضافية لتحسين المراجعات
  title: text("title"),
  images: text("images").array(),
  verifiedPurchase: boolean("verified_purchase").default(false)
});
var insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  storeId: true,
  content: true,
  rating: true,
  title: true,
  images: true,
  verifiedPurchase: true
});
var paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  isActive: boolean("is_active").default(true)
});
var insertPaymentMethodSchema = createInsertSchema(paymentMethods).pick({
  name: true,
  image: true,
  isActive: true
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true)
});
var insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  isActive: true
});
var advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  link: text("link"),
  isActive: boolean("is_active").default(true)
});
var insertAdvertisementSchema = createInsertSchema(advertisements).pick({
  title: true,
  description: true,
  image: true,
  link: true,
  isActive: true
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, processing, shipped, delivered, canceled
  paymentStatus: text("payment_status").notNull().default("pending"),
  // pending, paid, failed
  paymentMethod: text("payment_method").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  shippingCost: doublePrecision("shipping_cost").notNull(),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});
var insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  orderNumber: true,
  totalAmount: true,
  paymentMethod: true,
  shippingAddress: true,
  shippingMethod: true,
  shippingCost: true,
  notes: true
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  status: text("status").notNull().default("pending")
  // يمكن أن تكون حالة عنصر الطلب مختلفة عن حالة الطلب ككل
});
var insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  storeId: true,
  quantity: true,
  price: true,
  subtotal: true
});
var wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  notificationEnabled: boolean("notification_enabled").default(false)
  // تفعيل إشعارات توفر المنتج
});
var insertWishlistSchema = createInsertSchema(wishlists).pick({
  userId: true,
  productId: true,
  notificationEnabled: true
});
var carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});
var insertCartSchema = createInsertSchema(carts).pick({
  userId: true
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at").defaultNow()
});
var insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true
});
var supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storeId: integer("store_id"),
  // قد تكون التذكرة متعلقة بمتجر محدد
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(),
  // open, in_progress, resolved, closed
  priority: text("priority").default("medium").notNull(),
  // low, medium, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  closedAt: timestamp("closed_at")
});
var insertSupportTicketSchema = createInsertSchema(supportTickets).pick({
  userId: true,
  storeId: true,
  subject: true,
  description: true,
  priority: true
});
var supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  isStaffResponse: boolean("is_staff_response").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  attachments: text("attachments").array()
});
var insertSupportMessageSchema = createInsertSchema(supportMessages).pick({
  ticketId: true,
  userId: true,
  message: true,
  isStaffResponse: true,
  attachments: true
});
var storeAnalytics = pgTable("store_analytics", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  productViews: integer("product_views").default(0),
  ordersCount: integer("orders_count").default(0),
  revenue: doublePrecision("revenue").default(0),
  conversionRate: doublePrecision("conversion_rate").default(0),
  averageOrderValue: doublePrecision("average_order_value").default(0)
});
var usersRelations = relations(users, ({ many }) => ({
  stores: many(stores),
  reviews: many(reviews),
  orders: many(orders),
  wishlists: many(wishlists),
  carts: many(carts),
  supportTickets: many(supportTickets),
  supportMessages: many(supportMessages)
}));
var storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id]
  }),
  products: many(products),
  analytics: many(storeAnalytics),
  orderItems: many(orderItems),
  supportTickets: many(supportTickets)
}));
var productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id]
  }),
  reviews: many(reviews),
  orderItems: many(orderItems),
  wishlists: many(wishlists),
  cartItems: many(cartItems)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  }),
  store: one(stores, {
    fields: [reviews.storeId],
    references: [stores.id]
  })
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  store: one(stores, {
    fields: [orderItems.storeId],
    references: [stores.id]
  })
}));
var wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id]
  })
}));
var cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  }),
  items: many(cartItems)
}));
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));
var supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id]
  }),
  store: one(stores, {
    fields: [supportTickets.storeId],
    references: [stores.id]
  }),
  messages: many(supportMessages)
}));
var supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportMessages.ticketId],
    references: [supportTickets.id]
  }),
  user: one(users, {
    fields: [supportMessages.userId],
    references: [users.id]
  })
}));
var storeAnalyticsRelations = relations(storeAnalytics, ({ one }) => ({
  store: one(stores, {
    fields: [storeAnalytics.storeId],
    references: [stores.id]
  })
}));

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, sql } from "drizzle-orm";
var MemStorage = class {
  users;
  stores;
  products;
  reviews;
  paymentMethods;
  categories;
  advertisements;
  currentUserId;
  currentStoreId;
  currentProductId;
  currentReviewId;
  currentPaymentMethodId;
  currentCategoryId;
  currentAdvertisementId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.stores = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.reviews = /* @__PURE__ */ new Map();
    this.paymentMethods = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.advertisements = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentStoreId = 1;
    this.currentProductId = 1;
    this.currentReviewId = 1;
    this.currentPaymentMethodId = 1;
    this.currentCategoryId = 1;
    this.currentAdvertisementId = 1;
    this.initSampleData();
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      isVerified: false,
      avatar: insertUser.avatar || null,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }
  // Stores
  async getStore(id) {
    return this.stores.get(id);
  }
  async getStores() {
    return Array.from(this.stores.values());
  }
  async getFeaturedStores(limit = 4) {
    const stores2 = Array.from(this.stores.values());
    return stores2.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
  }
  async createStore(insertStore) {
    const id = this.currentStoreId++;
    const store = {
      ...insertStore,
      id,
      isSubscribed: false,
      subscriptionExpiresAt: null,
      rating: 0,
      productCount: 0,
      logo: insertStore.logo || null,
      coverImage: insertStore.coverImage || null
    };
    this.stores.set(id, store);
    return store;
  }
  async updateStoreSubscription(id, isSubscribed, expiresAt) {
    const store = await this.getStore(id);
    if (!store) {
      throw new Error(`Store with id ${id} not found`);
    }
    const updatedStore = {
      ...store,
      isSubscribed,
      subscriptionExpiresAt: expiresAt
    };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }
  // Products
  async getProduct(id) {
    return this.products.get(id);
  }
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProductsByStore(storeId) {
    return Array.from(this.products.values()).filter(
      (product) => product.storeId === storeId
    );
  }
  async getFeaturedProducts(limit = 5) {
    const products2 = Array.from(this.products.values());
    return products2.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, limit);
  }
  async createProduct(insertProduct) {
    const id = this.currentProductId++;
    const product = {
      ...insertProduct,
      id,
      rating: 0,
      salesCount: 0,
      oldPrice: insertProduct.oldPrice || null,
      isNew: insertProduct.isNew || false,
      hasDiscount: insertProduct.hasDiscount || false,
      isBestseller: insertProduct.isBestseller || false
    };
    this.products.set(id, product);
    const store = await this.getStore(insertProduct.storeId);
    if (store) {
      const updatedStore = {
        ...store,
        productCount: (store.productCount || 0) + 1
      };
      this.stores.set(store.id, updatedStore);
    }
    return product;
  }
  // Reviews
  async getReview(id) {
    return this.reviews.get(id);
  }
  async getReviews() {
    return Array.from(this.reviews.values());
  }
  async getFeaturedReviews(limit = 3) {
    const reviews2 = Array.from(this.reviews.values());
    return reviews2.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, limit);
  }
  async createReview(insertReview) {
    const id = this.currentReviewId++;
    const review = {
      ...insertReview,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      likes: 0,
      comments: 0
    };
    this.reviews.set(id, review);
    return review;
  }
  // Payment Methods
  async getPaymentMethod(id) {
    return this.paymentMethods.get(id);
  }
  async getPaymentMethods() {
    return Array.from(this.paymentMethods.values());
  }
  async createPaymentMethod(insertPaymentMethod) {
    const id = this.currentPaymentMethodId++;
    const paymentMethod = {
      ...insertPaymentMethod,
      id,
      isActive: insertPaymentMethod.isActive ?? true
    };
    this.paymentMethods.set(id, paymentMethod);
    return paymentMethod;
  }
  // Categories
  async getCategory(id) {
    return this.categories.get(id);
  }
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async createCategory(insertCategory) {
    const id = this.currentCategoryId++;
    const category = {
      ...insertCategory,
      id,
      isActive: insertCategory.isActive ?? true
    };
    this.categories.set(id, category);
    return category;
  }
  // Advertisements
  async getAdvertisement(id) {
    return this.advertisements.get(id);
  }
  async getAdvertisements() {
    return Array.from(this.advertisements.values());
  }
  async getActiveAdvertisements() {
    return Array.from(this.advertisements.values()).filter((ad) => ad.isActive);
  }
  async createAdvertisement(insertAdvertisement) {
    const id = this.currentAdvertisementId++;
    const advertisement = {
      ...insertAdvertisement,
      id,
      link: insertAdvertisement.link || null,
      isActive: insertAdvertisement.isActive ?? true
    };
    this.advertisements.set(id, advertisement);
    return advertisement;
  }
  // Initialize sample data
  initSampleData() {
    const user1 = {
      id: this.currentUserId++,
      username: "mohammed",
      password: "password123",
      name: "\u0645\u062D\u0645\u062F \u0623\u062D\u0645\u062F",
      email: "mohammed@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      phone: "+967123456789",
      isVerified: true
    };
    const user2 = {
      id: this.currentUserId++,
      username: "sara",
      password: "password123",
      name: "\u0633\u0627\u0631\u0629 \u0645\u062D\u0645\u062F",
      email: "sara@example.com",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      phone: "+967987654321",
      isVerified: true
    };
    const user3 = {
      id: this.currentUserId++,
      username: "khaled",
      password: "password123",
      name: "\u062E\u0627\u0644\u062F \u0627\u0644\u0639\u0645\u0631\u064A",
      email: "khaled@example.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      phone: "+967456789123",
      isVerified: true
    };
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    const store1 = {
      id: this.currentStoreId++,
      userId: user1.id,
      name: "\u0645\u062A\u062C\u0631 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A",
      description: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0648\u0623\u062C\u0647\u0632\u0629 \u0645\u0646\u0632\u0644\u064A\u0629",
      logo: "https://placehold.co/100x100?text=E",
      coverImage: "https://placehold.co/500x300?text=Electronics",
      category: "electronics",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      rating: 4.8,
      productCount: 50
    };
    const store2 = {
      id: this.currentStoreId++,
      userId: user2.id,
      name: "\u0645\u062A\u062C\u0631 \u0627\u0644\u0623\u0632\u064A\u0627\u0621",
      description: "\u0645\u0644\u0627\u0628\u0633 \u0648\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A",
      logo: "https://placehold.co/100x100?text=F",
      coverImage: "https://placehold.co/500x300?text=Fashion",
      category: "fashion",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      rating: 4.5,
      productCount: 120
    };
    const store3 = {
      id: this.currentStoreId++,
      userId: user3.id,
      name: "\u0645\u062A\u062C\u0631 \u0627\u0644\u0623\u062C\u0647\u0632\u0629",
      description: "\u0623\u062C\u0647\u0632\u0629 \u0630\u0643\u064A\u0629 \u0648\u0645\u0644\u062D\u0642\u0627\u062A\u0647\u0627",
      logo: "https://placehold.co/100x100?text=G",
      coverImage: "https://placehold.co/500x300?text=Gadgets",
      category: "electronics",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      rating: 4.7,
      productCount: 85
    };
    const store4 = {
      id: this.currentStoreId++,
      userId: user1.id,
      name: "\u0645\u062A\u062C\u0631 \u0627\u0644\u0635\u062D\u0629",
      description: "\u0645\u0646\u062A\u062C\u0627\u062A \u0635\u062D\u064A\u0629 \u0648\u063A\u0630\u0627\u0626\u064A\u0629",
      logo: "https://placehold.co/100x100?text=H",
      coverImage: "https://placehold.co/500x300?text=Health",
      category: "health",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      rating: 4.9,
      productCount: 40
    };
    this.stores.set(store1.id, store1);
    this.stores.set(store2.id, store2);
    this.stores.set(store3.id, store3);
    this.stores.set(store4.id, store4);
    const product1 = {
      id: this.currentProductId++,
      storeId: store1.id,
      name: "\u0633\u0645\u0627\u0639\u0627\u062A \u0644\u0627\u0633\u0644\u0643\u064A\u0629 \u0641\u0627\u062E\u0631\u0629",
      description: "\u0633\u0645\u0627\u0639\u0627\u062A \u0628\u0644\u0648\u062A\u0648\u062B \u0644\u0627\u0633\u0644\u0643\u064A\u0629 \u0628\u062C\u0648\u062F\u0629 \u0635\u0648\u062A \u0639\u0627\u0644\u064A\u0629 \u0648\u0645\u062F\u0629 \u0628\u0637\u0627\u0631\u064A\u0629 \u0637\u0648\u064A\u0644\u0629",
      image: "https://placehold.co/400x400?text=Headphones",
      price: 49.99,
      oldPrice: 79.99,
      category: "electronics",
      rating: 4.8,
      salesCount: 150,
      isNew: true,
      hasDiscount: true,
      isBestseller: false
    };
    const product2 = {
      id: this.currentProductId++,
      storeId: store3.id,
      name: "\u0633\u0627\u0639\u0629 \u0630\u0643\u064A\u0629 \u0645\u062A\u0637\u0648\u0631\u0629",
      description: "\u0633\u0627\u0639\u0629 \u0630\u0643\u064A\u0629 \u0628\u0634\u0627\u0634\u0629 \u0644\u0645\u0633 \u0648\u0645\u064A\u0632\u0627\u062A \u0635\u062D\u064A\u0629 \u0645\u062A\u0639\u062F\u062F\u0629 \u0648\u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0645\u0627\u0621",
      image: "https://placehold.co/400x400?text=SmartWatch",
      price: 89.99,
      oldPrice: 129.99,
      category: "electronics",
      rating: 4.7,
      salesCount: 85,
      isNew: false,
      hasDiscount: true,
      isBestseller: false
    };
    const product3 = {
      id: this.currentProductId++,
      storeId: store2.id,
      name: "\u062D\u0642\u064A\u0628\u0629 \u0638\u0647\u0631 \u0639\u0635\u0631\u064A\u0629",
      description: "\u062D\u0642\u064A\u0628\u0629 \u0638\u0647\u0631 \u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0645\u0627\u0621 \u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u062C\u0627\u0645\u0639\u0629 \u0648\u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0645\u0639 \u0645\u0633\u0627\u062D\u0629 \u0644\u0644\u062D\u0627\u0633\u0648\u0628 \u0627\u0644\u0645\u062D\u0645\u0648\u0644",
      image: "https://placehold.co/400x400?text=Backpack",
      price: 34.99,
      oldPrice: 44.99,
      category: "fashion",
      rating: 4.5,
      salesCount: 120,
      isNew: false,
      hasDiscount: true,
      isBestseller: false
    };
    const product4 = {
      id: this.currentProductId++,
      storeId: store1.id,
      name: "\u0645\u0635\u0628\u0627\u062D \u0630\u0643\u064A RGB",
      description: "\u0645\u0635\u0628\u0627\u062D \u0630\u0643\u064A \u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u062D\u0643\u0645 \u0639\u0628\u0631 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u0639 16 \u0645\u0644\u064A\u0648\u0646 \u0644\u0648\u0646 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0645\u062E\u062A\u0644\u0641\u0629",
      image: "https://placehold.co/400x400?text=SmartLight",
      price: 29.99,
      oldPrice: 39.99,
      category: "electronics",
      rating: 4.6,
      salesCount: 75,
      isNew: false,
      hasDiscount: true,
      isBestseller: false
    };
    const product5 = {
      id: this.currentProductId++,
      storeId: store3.id,
      name: "\u0634\u0627\u062D\u0646 \u0644\u0627\u0633\u0644\u0643\u064A \u0633\u0631\u064A\u0639",
      description: "\u0634\u0627\u062D\u0646 \u0644\u0627\u0633\u0644\u0643\u064A \u0633\u0631\u064A\u0639 \u0645\u062A\u0648\u0627\u0641\u0642 \u0645\u0639 \u062C\u0645\u064A\u0639 \u0627\u0644\u0647\u0648\u0627\u062A\u0641 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u062D\u062F\u064A\u062B\u0629",
      image: "https://placehold.co/400x400?text=WirelessCharger",
      price: 24.99,
      oldPrice: 39.99,
      category: "electronics",
      rating: 4.9,
      salesCount: 200,
      isNew: false,
      hasDiscount: true,
      isBestseller: true
    };
    this.products.set(product1.id, product1);
    this.products.set(product2.id, product2);
    this.products.set(product3.id, product3);
    this.products.set(product4.id, product4);
    this.products.set(product5.id, product5);
    const review1 = {
      id: this.currentReviewId++,
      userId: user1.id,
      content: "\u062A\u062C\u0631\u0628\u0629 \u0631\u0627\u0626\u0639\u0629 \u0645\u0639 \u0627\u0644\u0645\u0646\u0635\u0629\u060C \u0633\u0647\u0648\u0644\u0629 \u0641\u064A \u0627\u0644\u062A\u0635\u0641\u062D \u0648\u0627\u0644\u0634\u0631\u0627\u0621 \u0648\u0633\u0631\u0639\u0629 \u0641\u064A \u0627\u0644\u062A\u0648\u0635\u064A\u0644. \u0623\u0646\u0635\u062D \u0627\u0644\u062C\u0645\u064A\u0639 \u0628\u062A\u062C\u0631\u0628\u062A\u0647\u0627!",
      rating: 5,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3),
      likes: 24,
      comments: 3
    };
    const review2 = {
      id: this.currentReviewId++,
      userId: user2.id,
      content: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0630\u0627\u062A \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629 \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u0639\u0642\u0648\u0644\u0629. \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0643\u0627\u0646 \u0645\u062A\u0623\u062E\u0631\u0627\u064B \u0642\u0644\u064A\u0644\u0627\u064B \u0644\u0643\u0646 \u062E\u062F\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0643\u0627\u0646\u062A \u0645\u062A\u0639\u0627\u0648\u0646\u0629 \u062C\u062F\u0627\u064B.",
      rating: 4,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
      likes: 18,
      comments: 5
    };
    const review3 = {
      id: this.currentReviewId++,
      userId: user3.id,
      content: "\u0623\u0641\u0636\u0644 \u0645\u0646\u0635\u0629 \u0644\u0644\u062A\u0633\u0648\u0642 \u0627\u0644\u064A\u0645\u0646\u064A! \u0648\u062C\u062F\u062A \u0643\u0644 \u0645\u0627 \u0623\u062D\u062A\u0627\u062C\u0647 \u0628\u0633\u0647\u0648\u0644\u0629 \u0648\u0627\u0644\u062F\u0641\u0639 \u0622\u0645\u0646 \u0648\u0633\u0631\u064A\u0639. \u0633\u0623\u0633\u062A\u0645\u0631 \u0628\u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646\u0647\u0627 \u0628\u0627\u0644\u062A\u0623\u0643\u064A\u062F.",
      rating: 5,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
      likes: 42,
      comments: 7
    };
    this.reviews.set(review1.id, review1);
    this.reviews.set(review2.id, review2);
    this.reviews.set(review3.id, review3);
    const paymentMethod1 = {
      id: this.currentPaymentMethodId++,
      name: "Visa",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      isActive: true
    };
    const paymentMethod2 = {
      id: this.currentPaymentMethodId++,
      name: "Mastercard",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
      isActive: true
    };
    const paymentMethod3 = {
      id: this.currentPaymentMethodId++,
      name: "PayPal",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png",
      isActive: true
    };
    const paymentMethod4 = {
      id: this.currentPaymentMethodId++,
      name: "Apple Pay",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
      isActive: true
    };
    const paymentMethod5 = {
      id: this.currentPaymentMethodId++,
      name: "Google Pay",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
      isActive: true
    };
    this.paymentMethods.set(paymentMethod1.id, paymentMethod1);
    this.paymentMethods.set(paymentMethod2.id, paymentMethod2);
    this.paymentMethods.set(paymentMethod3.id, paymentMethod3);
    this.paymentMethods.set(paymentMethod4.id, paymentMethod4);
    this.paymentMethods.set(paymentMethod5.id, paymentMethod5);
    const category1 = {
      id: this.currentCategoryId++,
      name: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A",
      icon: "mobile-alt",
      isActive: true
    };
    const category2 = {
      id: this.currentCategoryId++,
      name: "\u0627\u0644\u0645\u0644\u0627\u0628\u0633",
      icon: "tshirt",
      isActive: true
    };
    const category3 = {
      id: this.currentCategoryId++,
      name: "\u0627\u0644\u0645\u0646\u0632\u0644 \u0648\u0627\u0644\u0645\u0637\u0628\u062E",
      icon: "home",
      isActive: true
    };
    const category4 = {
      id: this.currentCategoryId++,
      name: "\u0627\u0644\u0635\u062D\u0629 \u0648\u0627\u0644\u062C\u0645\u0627\u0644",
      icon: "heartbeat",
      isActive: true
    };
    const category5 = {
      id: this.currentCategoryId++,
      name: "\u0623\u0644\u0639\u0627\u0628 \u0648\u0647\u0648\u0627\u064A\u0627\u062A",
      icon: "gamepad",
      isActive: true
    };
    this.categories.set(category1.id, category1);
    this.categories.set(category2.id, category2);
    this.categories.set(category3.id, category3);
    this.categories.set(category4.id, category4);
    this.categories.set(category5.id, category5);
    const advertisement1 = {
      id: this.currentAdvertisementId++,
      title: "\u0639\u0631\u0648\u0636 \u0631\u0645\u0636\u0627\u0646 \u0627\u0644\u062D\u0635\u0631\u064A\u0629",
      description: "\u062E\u0635\u0648\u0645\u0627\u062A \u062A\u0635\u0644 \u0625\u0644\u0649 50% \u0639\u0644\u0649 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
      image: "https://placehold.co/1050x400?text=Ramadan+Offers",
      link: "/offers",
      isActive: true
    };
    const advertisement2 = {
      id: this.currentAdvertisementId++,
      title: "\u062A\u062E\u0641\u064A\u0636\u0627\u062A \u0627\u0644\u0635\u064A\u0641",
      description: "\u062E\u0635\u0648\u0645\u0627\u062A \u0631\u0627\u0626\u0639\u0629 \u0639\u0644\u0649 \u0643\u0644 \u0645\u0627 \u062A\u062D\u062A\u0627\u062C\u0647 \u0644\u0644\u0635\u064A\u0641",
      image: "https://placehold.co/1050x400?text=Summer+Sale",
      link: "/summer-sale",
      isActive: true
    };
    const advertisement3 = {
      id: this.currentAdvertisementId++,
      title: "\u0645\u0646\u062A\u062C\u0627\u062A \u062C\u062F\u064A\u062F\u0629",
      description: "\u062A\u0635\u0641\u062D \u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0636\u0627\u0641\u0629 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
      image: "https://placehold.co/1050x400?text=New+Arrivals",
      link: "/new-arrivals",
      isActive: true
    };
    this.advertisements.set(advertisement1.id, advertisement1);
    this.advertisements.set(advertisement2.id, advertisement2);
    this.advertisements.set(advertisement3.id, advertisement3);
  }
};
var storage = new MemStorage();

// server/routes.ts
import fetch from "node-fetch";
async function verifyRecaptcha(token) {
  try {
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecretKey) {
      console.error("RECAPTCHA_SECRET_KEY environment variable is not set");
      return false;
    }
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `secret=${recaptchaSecretKey}&response=${token}`
    });
    if (!response.ok) {
      console.error("reCAPTCHA verification failed");
      return false;
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}
async function registerRoutes(app2) {
  app2.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  app2.post("/api/users/register", async (req, res) => {
    try {
      const { recaptchaToken, ...userData } = req.body;
      if (!recaptchaToken) {
        return res.status(400).json({ message: "reCAPTCHA token is required" });
      }
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA verification failed" });
      }
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in register:", error);
      res.status(400).json({ message: "Failed to create user" });
    }
  });
  app2.post("/api/users/login", async (req, res) => {
    try {
      const { username, password, recaptchaToken } = req.body;
      if (!recaptchaToken) {
        return res.status(400).json({ message: "reCAPTCHA token is required" });
      }
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA verification failed" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Error during login" });
    }
  });
  app2.get("/api/stores", async (req, res) => {
    const stores2 = await storage.getStores();
    res.json(stores2);
  });
  app2.get("/api/stores/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const stores2 = await storage.getFeaturedStores(limit);
    res.json(stores2);
  });
  app2.get("/api/stores/:id", async (req, res) => {
    const storeId = parseInt(req.params.id);
    const store = await storage.getStore(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  });
  app2.post("/api/stores", async (req, res) => {
    try {
      const newStore = await storage.createStore(req.body);
      res.status(201).json(newStore);
    } catch (error) {
      res.status(400).json({ message: "Failed to create store" });
    }
  });
  app2.post("/api/stores/:id/subscribe", async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      const expiryDate = /* @__PURE__ */ new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      const updatedStore = await storage.updateStoreSubscription(storeId, true, expiryDate);
      res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: "Failed to subscribe" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    const products2 = await storage.getProducts();
    res.json(products2);
  });
  app2.get("/api/products/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const products2 = await storage.getFeaturedProducts(limit);
    res.json(products2);
  });
  app2.get("/api/products/:id", async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });
  app2.get("/api/stores/:storeId/products", async (req, res) => {
    const storeId = parseInt(req.params.storeId);
    const products2 = await storage.getProductsByStore(storeId);
    res.json(products2);
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const newProduct = await storage.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: "Failed to create product" });
    }
  });
  app2.get("/api/reviews", async (req, res) => {
    const reviews2 = await storage.getReviews();
    res.json(reviews2);
  });
  app2.get("/api/reviews/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const reviews2 = await storage.getFeaturedReviews(limit);
    res.json(reviews2);
  });
  app2.get("/api/reviews/:id", async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = await storage.getReview(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  });
  app2.post("/api/reviews", async (req, res) => {
    try {
      const newReview = await storage.createReview(req.body);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ message: "Failed to create review" });
    }
  });
  app2.get("/api/payment-methods", async (req, res) => {
    const paymentMethods2 = await storage.getPaymentMethods();
    res.json(paymentMethods2);
  });
  app2.get("/api/categories", async (req, res) => {
    const categories2 = await storage.getCategories();
    res.json(categories2);
  });
  app2.get("/api/advertisements", async (req, res) => {
    const advertisements2 = await storage.getActiveAdvertisements();
    res.json(advertisements2);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
