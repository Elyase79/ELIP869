import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  phone: text("phone"),
  address: text("address"),
  role: text("role").default("user").notNull(), // "user", "vendor", "admin"
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  // إضافة حقول التكامل مع وسائل التواصل الاجتماعي
  googleId: text("google_id").unique(),
  facebookId: text("facebook_id").unique(),
  twitterId: text("twitter_id").unique(),
  // معلومات لاشتراكات المستخدم
  loyaltyPoints: integer("loyalty_points").default(0),
  membershipTier: text("membership_tier").default("standard"), // standard, silver, gold, platinum
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatar: true,
  phone: true,
  address: true,
});

export const stores = pgTable("stores", {
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
  productCount: integer("product_count").default(0),
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  userId: true,
  name: true,
  description: true,
  logo: true,
  coverImage: true,
  category: true,
});

export const products = pgTable("products", {
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
  sku: text("sku"), // رمز تعريف المنتج
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
  updatedAt: timestamp("updated_at"),
});

export const insertProductSchema = createInsertSchema(products).pick({
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
  dimensions: true,
});

export const reviews = pgTable("reviews", {
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
  verifiedPurchase: boolean("verified_purchase").default(false),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  storeId: true,
  content: true,
  rating: true,
  title: true,
  images: true,
  verifiedPurchase: true,
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).pick({
  name: true,
  image: true,
  isActive: true,
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  isActive: true,
});

export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  link: text("link"),
  isActive: boolean("is_active").default(true),
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).pick({
  title: true,
  description: true,
  image: true,
  link: true,
  isActive: true,
});

// جدول الطلبات
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, canceled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  paymentMethod: text("payment_method").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  shippingCost: doublePrecision("shipping_cost").notNull(),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  orderNumber: true,
  totalAmount: true,
  paymentMethod: true,
  shippingAddress: true,
  shippingMethod: true,
  shippingCost: true,
  notes: true,
});

// جدول عناصر الطلبات
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  status: text("status").notNull().default("pending"), // يمكن أن تكون حالة عنصر الطلب مختلفة عن حالة الطلب ككل
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  storeId: true,
  quantity: true,
  price: true,
  subtotal: true,
});

// جدول قوائم الأمنيات
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  notificationEnabled: boolean("notification_enabled").default(false), // تفعيل إشعارات توفر المنتج
});

export const insertWishlistSchema = createInsertSchema(wishlists).pick({
  userId: true,
  productId: true,
  notificationEnabled: true,
});

// جدول سلة التسوق
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertCartSchema = createInsertSchema(carts).pick({
  userId: true,
});

// جدول عناصر سلة التسوق
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true,
});

// جدول تذاكر الدعم
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storeId: integer("store_id"), // قد تكون التذكرة متعلقة بمتجر محدد
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(), // open, in_progress, resolved, closed
  priority: text("priority").default("medium").notNull(), // low, medium, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  closedAt: timestamp("closed_at"),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).pick({
  userId: true,
  storeId: true,
  subject: true,
  description: true,
  priority: true,
});

// جدول رسائل الدعم
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  isStaffResponse: boolean("is_staff_response").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  attachments: text("attachments").array(),
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).pick({
  ticketId: true,
  userId: true,
  message: true,
  isStaffResponse: true,
  attachments: true,
});

// جدول إحصائيات المتجر
export const storeAnalytics = pgTable("store_analytics", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  productViews: integer("product_views").default(0),
  ordersCount: integer("orders_count").default(0),
  revenue: doublePrecision("revenue").default(0),
  conversionRate: doublePrecision("conversion_rate").default(0),
  averageOrderValue: doublePrecision("average_order_value").default(0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
export type SupportMessage = typeof supportMessages.$inferSelect;

export type StoreAnalytic = typeof storeAnalytics.$inferSelect;

// العلاقات بين الجداول
export const usersRelations = relations(users, ({ many }) => ({
  stores: many(stores),
  reviews: many(reviews),
  orders: many(orders),
  wishlists: many(wishlists),
  carts: many(carts),
  supportTickets: many(supportTickets),
  supportMessages: many(supportMessages),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  products: many(products),
  analytics: many(storeAnalytics),
  orderItems: many(orderItems),
  supportTickets: many(supportTickets),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  reviews: many(reviews),
  orderItems: many(orderItems),
  wishlists: many(wishlists),
  cartItems: many(cartItems),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [reviews.storeId],
    references: [stores.id],
  }),
}));

// العلاقات للجداول الجديدة
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [orderItems.storeId],
    references: [stores.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [supportTickets.storeId],
    references: [stores.id],
  }),
  messages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportMessages.ticketId],
    references: [supportTickets.id],
  }),
  user: one(users, {
    fields: [supportMessages.userId],
    references: [users.id],
  }),
}));

export const storeAnalyticsRelations = relations(storeAnalytics, ({ one }) => ({
  store: one(stores, {
    fields: [storeAnalytics.storeId],
    references: [stores.id],
  }),
}));
