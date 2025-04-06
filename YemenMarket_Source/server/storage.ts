import { 
  users, type User, type InsertUser,
  stores, type Store, type InsertStore,
  products, type Product, type InsertProduct,
  reviews, type Review, type InsertReview,
  paymentMethods, type PaymentMethod, type InsertPaymentMethod,
  categories, type Category, type InsertCategory,
  advertisements, type Advertisement, type InsertAdvertisement,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  wishlists, type Wishlist, type InsertWishlist,
  carts, type Cart, type InsertCart,
  cartItems, type CartItem, type InsertCartItem,
  supportTickets, type SupportTicket, type InsertSupportTicket,
  supportMessages, type SupportMessage, type InsertSupportMessage,
  storeAnalytics, type StoreAnalytic
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLoyalty(userId: number, points: number): Promise<User>;
  updateUserMembership(userId: number, tier: string): Promise<User>;
  
  // Stores
  getStore(id: number): Promise<Store | undefined>;
  getStores(): Promise<Store[]>;
  getFeaturedStores(limit?: number): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  updateStoreSubscription(id: number, isSubscribed: boolean, expiresAt: Date): Promise<Store>;
  optimizeStore(id: number, optimizations: Partial<Store>): Promise<Store>;
  
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getProductsByStore(storeId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductInventory(productId: number, quantity: number): Promise<Product>;
  getLowStockProducts(storeId?: number): Promise<Product[]>;
  
  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviews(): Promise<Review[]>;
  getProductReviews(productId: number): Promise<Review[]>;
  getStoreReviews(storeId: number): Promise<Review[]>;
  getFeaturedReviews(limit?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  replyToReview(reviewId: number, content: string): Promise<Review>;
  
  // Payment Methods
  getPaymentMethod(id: number): Promise<PaymentMethod | undefined>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  
  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Advertisements
  getAdvertisement(id: number): Promise<Advertisement | undefined>;
  getAdvertisements(): Promise<Advertisement[]>;
  getActiveAdvertisements(): Promise<Advertisement[]>;
  createAdvertisement(advertisement: InsertAdvertisement): Promise<Advertisement>;
  
  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  getStoreOrders(storeId: number): Promise<OrderItem[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
  updateOrderPaymentStatus(orderId: number, paymentStatus: string): Promise<Order>;
  
  // Order Items
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderItemStatus(orderItemId: number, status: string): Promise<OrderItem>;
  
  // Wishlists
  getUserWishlist(userId: number): Promise<Wishlist[]>;
  addToWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(wishlistId: number): Promise<void>;
  enableWishlistNotification(wishlistId: number, enable: boolean): Promise<Wishlist>;
  
  // Carts
  getUserCart(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  clearCart(cartId: number): Promise<void>;
  
  // Cart Items
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
  removeCartItem(cartItemId: number): Promise<void>;
  
  // Support Tickets
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getUserSupportTickets(userId: number): Promise<SupportTicket[]>;
  getStoreSupportTickets(storeId: number): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicketStatus(ticketId: number, status: string): Promise<SupportTicket>;
  
  // Support Messages
  getSupportMessages(ticketId: number): Promise<SupportMessage[]>;
  createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage>;
  
  // Analytics
  getStoreAnalytics(storeId: number, startDate?: Date, endDate?: Date): Promise<StoreAnalytic[]>;
  recordPageView(storeId: number): Promise<void>;
  recordProductView(storeId: number, productId: number): Promise<void>;
  recordOrderCompleted(storeId: number, revenue: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stores: Map<number, Store>;
  private products: Map<number, Product>;
  private reviews: Map<number, Review>;
  private paymentMethods: Map<number, PaymentMethod>;
  private categories: Map<number, Category>;
  private advertisements: Map<number, Advertisement>;
  
  private currentUserId: number;
  private currentStoreId: number;
  private currentProductId: number;
  private currentReviewId: number;
  private currentPaymentMethodId: number;
  private currentCategoryId: number;
  private currentAdvertisementId: number;

  constructor() {
    this.users = new Map();
    this.stores = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.paymentMethods = new Map();
    this.categories = new Map();
    this.advertisements = new Map();
    
    this.currentUserId = 1;
    this.currentStoreId = 1;
    this.currentProductId = 1;
    this.currentReviewId = 1;
    this.currentPaymentMethodId = 1;
    this.currentCategoryId = 1;
    this.currentAdvertisementId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
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
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }
  
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }
  
  async getFeaturedStores(limit = 4): Promise<Store[]> {
    const stores = Array.from(this.stores.values());
    // Sort by rating and return top stores - handle nulls safely
    return stores.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
  }
  
  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.currentStoreId++;
    const store: Store = { 
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
  
  async updateStoreSubscription(id: number, isSubscribed: boolean, expiresAt: Date): Promise<Store> {
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
  
  async optimizeStore(id: number, optimizations: Partial<Store>): Promise<Store> {
    const store = await this.getStore(id);
    if (!store) {
      throw new Error(`Store with id ${id} not found`);
    }
    
    const updatedStore = {
      ...store,
      ...optimizations
    };
    
    this.stores.set(id, updatedStore);
    return updatedStore;
  }
  
  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByStore(storeId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.storeId === storeId
    );
  }
  
  async getFeaturedProducts(limit = 5): Promise<Product[]> {
    const products = Array.from(this.products.values());
    // Sort by salesCount and return top products - handle nulls safely
    return products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, limit);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
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
    
    // Update store product count
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
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }
  
  async getFeaturedReviews(limit = 3): Promise<Review[]> {
    const reviews = Array.from(this.reviews.values());
    // Sort by likes and return top reviews - handle nulls safely
    return reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, limit);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date(),
      likes: 0,
      comments: 0
    };
    this.reviews.set(id, review);
    return review;
  }
  
  // Payment Methods
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    return this.paymentMethods.get(id);
  }
  
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values());
  }
  
  async createPaymentMethod(insertPaymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const id = this.currentPaymentMethodId++;
    const paymentMethod: PaymentMethod = { 
      ...insertPaymentMethod, 
      id,
      isActive: insertPaymentMethod.isActive ?? true
    };
    this.paymentMethods.set(id, paymentMethod);
    return paymentMethod;
  }
  
  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      isActive: insertCategory.isActive ?? true
    };
    this.categories.set(id, category);
    return category;
  }
  
  // Advertisements
  async getAdvertisement(id: number): Promise<Advertisement | undefined> {
    return this.advertisements.get(id);
  }
  
  async getAdvertisements(): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values());
  }
  
  async getActiveAdvertisements(): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values()).filter(ad => ad.isActive);
  }
  
  async createAdvertisement(insertAdvertisement: InsertAdvertisement): Promise<Advertisement> {
    const id = this.currentAdvertisementId++;
    const advertisement: Advertisement = { 
      ...insertAdvertisement, 
      id,
      link: insertAdvertisement.link || null,
      isActive: insertAdvertisement.isActive ?? true
    };
    this.advertisements.set(id, advertisement);
    return advertisement;
  }

  // Initialize sample data
  private initSampleData() {
    // Sample Users
    const user1: User = {
      id: this.currentUserId++,
      username: "mohammed",
      password: "password123",
      name: "محمد أحمد",
      email: "mohammed@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      phone: "+967123456789",
      isVerified: true
    };
    
    const user2: User = {
      id: this.currentUserId++,
      username: "sara",
      password: "password123",
      name: "سارة محمد",
      email: "sara@example.com",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      phone: "+967987654321",
      isVerified: true
    };
    
    const user3: User = {
      id: this.currentUserId++,
      username: "khaled",
      password: "password123",
      name: "خالد العمري",
      email: "khaled@example.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      phone: "+967456789123",
      isVerified: true
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    
    // Sample Stores
    const store1: Store = {
      id: this.currentStoreId++,
      userId: user1.id,
      name: "متجر الإلكترونيات",
      description: "إلكترونيات وأجهزة منزلية",
      logo: "https://placehold.co/100x100?text=E",
      coverImage: "https://placehold.co/500x300?text=Electronics",
      category: "electronics",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      rating: 4.8,
      productCount: 50
    };
    
    const store2: Store = {
      id: this.currentStoreId++,
      userId: user2.id,
      name: "متجر الأزياء",
      description: "ملابس وإكسسوارات",
      logo: "https://placehold.co/100x100?text=F",
      coverImage: "https://placehold.co/500x300?text=Fashion",
      category: "fashion",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      rating: 4.5,
      productCount: 120
    };
    
    const store3: Store = {
      id: this.currentStoreId++,
      userId: user3.id,
      name: "متجر الأجهزة",
      description: "أجهزة ذكية وملحقاتها",
      logo: "https://placehold.co/100x100?text=G",
      coverImage: "https://placehold.co/500x300?text=Gadgets",
      category: "electronics",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      rating: 4.7,
      productCount: 85
    };
    
    const store4: Store = {
      id: this.currentStoreId++,
      userId: user1.id,
      name: "متجر الصحة",
      description: "منتجات صحية وغذائية",
      logo: "https://placehold.co/100x100?text=H",
      coverImage: "https://placehold.co/500x300?text=Health",
      category: "health",
      isSubscribed: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      rating: 4.9,
      productCount: 40
    };
    
    this.stores.set(store1.id, store1);
    this.stores.set(store2.id, store2);
    this.stores.set(store3.id, store3);
    this.stores.set(store4.id, store4);
    
    // Sample Products
    const product1: Product = {
      id: this.currentProductId++,
      storeId: store1.id,
      name: "سماعات لاسلكية فاخرة",
      description: "سماعات بلوتوث لاسلكية بجودة صوت عالية ومدة بطارية طويلة",
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
    
    const product2: Product = {
      id: this.currentProductId++,
      storeId: store3.id,
      name: "ساعة ذكية متطورة",
      description: "ساعة ذكية بشاشة لمس وميزات صحية متعددة ومقاومة للماء",
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
    
    const product3: Product = {
      id: this.currentProductId++,
      storeId: store2.id,
      name: "حقيبة ظهر عصرية",
      description: "حقيبة ظهر مقاومة للماء مناسبة للجامعة والرحلات مع مساحة للحاسوب المحمول",
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
    
    const product4: Product = {
      id: this.currentProductId++,
      storeId: store1.id,
      name: "مصباح ذكي RGB",
      description: "مصباح ذكي قابل للتحكم عبر التطبيق مع 16 مليون لون وإعدادات مختلفة",
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
    
    const product5: Product = {
      id: this.currentProductId++,
      storeId: store3.id,
      name: "شاحن لاسلكي سريع",
      description: "شاحن لاسلكي سريع متوافق مع جميع الهواتف الذكية الحديثة",
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
    
    // Sample Reviews
    const review1: Review = {
      id: this.currentReviewId++,
      userId: user1.id,
      content: "تجربة رائعة مع المنصة، سهولة في التصفح والشراء وسرعة في التوصيل. أنصح الجميع بتجربتها!",
      rating: 5,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 24,
      comments: 3
    };
    
    const review2: Review = {
      id: this.currentReviewId++,
      userId: user2.id,
      content: "المنتجات ذات جودة عالية والأسعار معقولة. التوصيل كان متأخراً قليلاً لكن خدمة العملاء كانت متعاونة جداً.",
      rating: 4,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      likes: 18,
      comments: 5
    };
    
    const review3: Review = {
      id: this.currentReviewId++,
      userId: user3.id,
      content: "أفضل منصة للتسوق اليمني! وجدت كل ما أحتاجه بسهولة والدفع آمن وسريع. سأستمر بالشراء منها بالتأكيد.",
      rating: 5,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      likes: 42,
      comments: 7
    };
    
    this.reviews.set(review1.id, review1);
    this.reviews.set(review2.id, review2);
    this.reviews.set(review3.id, review3);
    
    // Sample Payment Methods
    const paymentMethod1: PaymentMethod = {
      id: this.currentPaymentMethodId++,
      name: "Visa",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      isActive: true
    };
    
    const paymentMethod2: PaymentMethod = {
      id: this.currentPaymentMethodId++,
      name: "Mastercard",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
      isActive: true
    };
    
    const paymentMethod3: PaymentMethod = {
      id: this.currentPaymentMethodId++,
      name: "PayPal",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png",
      isActive: true
    };
    
    const paymentMethod4: PaymentMethod = {
      id: this.currentPaymentMethodId++,
      name: "Apple Pay",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
      isActive: true
    };
    
    const paymentMethod5: PaymentMethod = {
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
    
    // Sample Categories
    const category1: Category = {
      id: this.currentCategoryId++,
      name: "الإلكترونيات",
      icon: "mobile-alt",
      isActive: true
    };
    
    const category2: Category = {
      id: this.currentCategoryId++,
      name: "الملابس",
      icon: "tshirt",
      isActive: true
    };
    
    const category3: Category = {
      id: this.currentCategoryId++,
      name: "المنزل والمطبخ",
      icon: "home",
      isActive: true
    };
    
    const category4: Category = {
      id: this.currentCategoryId++,
      name: "الصحة والجمال",
      icon: "heartbeat",
      isActive: true
    };
    
    const category5: Category = {
      id: this.currentCategoryId++,
      name: "ألعاب وهوايات",
      icon: "gamepad",
      isActive: true
    };
    
    this.categories.set(category1.id, category1);
    this.categories.set(category2.id, category2);
    this.categories.set(category3.id, category3);
    this.categories.set(category4.id, category4);
    this.categories.set(category5.id, category5);
    
    // Sample Advertisements
    const advertisement1: Advertisement = {
      id: this.currentAdvertisementId++,
      title: "عروض رمضان الحصرية",
      description: "خصومات تصل إلى 50% على جميع المنتجات",
      image: "https://placehold.co/1050x400?text=Ramadan+Offers",
      link: "/offers",
      isActive: true
    };
    
    const advertisement2: Advertisement = {
      id: this.currentAdvertisementId++,
      title: "تخفيضات الصيف",
      description: "خصومات رائعة على كل ما تحتاجه للصيف",
      image: "https://placehold.co/1050x400?text=Summer+Sale",
      link: "/summer-sale",
      isActive: true
    };
    
    const advertisement3: Advertisement = {
      id: this.currentAdvertisementId++,
      title: "منتجات جديدة",
      description: "تصفح أحدث المنتجات المضافة هذا الشهر",
      image: "https://placehold.co/1050x400?text=New+Arrivals",
      link: "/new-arrivals",
      isActive: true
    };
    
    this.advertisements.set(advertisement1.id, advertisement1);
    this.advertisements.set(advertisement2.id, advertisement2);
    this.advertisements.set(advertisement3.id, advertisement3);
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure null values for optional fields
    const userToInsert = {
      ...insertUser,
      avatar: insertUser.avatar === undefined ? null : insertUser.avatar,
      phone: insertUser.phone === undefined ? null : insertUser.phone,
      isVerified: false
    };
    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }
  
  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }
  
  async getStores(): Promise<Store[]> {
    return db.select().from(stores);
  }
  
  async getFeaturedStores(limit = 4): Promise<Store[]> {
    // Sort by rating and return top stores, with null ratings treated as 0
    return db.select().from(stores)
      .orderBy(sql`COALESCE(${stores.rating}, 0) DESC`)
      .limit(limit);
  }
  
  async createStore(insertStore: InsertStore): Promise<Store> {
    const storeToInsert = {
      ...insertStore,
      logo: insertStore.logo === undefined ? null : insertStore.logo,
      coverImage: insertStore.coverImage === undefined ? null : insertStore.coverImage,
      isSubscribed: false,
      subscriptionExpiresAt: null,
      rating: 0,
      productCount: 0
    };
    const [store] = await db.insert(stores).values(storeToInsert).returning();
    return store;
  }
  
  async updateStoreSubscription(id: number, isSubscribed: boolean, expiresAt: Date): Promise<Store> {
    const [store] = await db
      .update(stores)
      .set({
        isSubscribed: isSubscribed,
        subscriptionExpiresAt: expiresAt,
      })
      .where(eq(stores.id, id))
      .returning();
    
    if (!store) {
      throw new Error(`Store with id ${id} not found`);
    }
    
    return store;
  }
  
  async optimizeStore(id: number, optimizations: Partial<Store>): Promise<Store> {
    const [store] = await db
      .update(stores)
      .set(optimizations)
      .where(eq(stores.id, id))
      .returning();
    
    if (!store) {
      throw new Error(`Store with id ${id} not found`);
    }
    
    return store;
  }
  
  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProductsByStore(storeId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.storeId, storeId));
  }
  
  async getFeaturedProducts(limit = 5): Promise<Product[]> {
    // Sort by salesCount and return top products, with null salesCount treated as 0
    return db.select().from(products)
      .orderBy(sql`COALESCE(${products.salesCount}, 0) DESC`)
      .limit(limit);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    // Begin transaction
    return await db.transaction(async (tx) => {
      // Create product with all optional fields handled
      const productToInsert = {
        ...insertProduct,
        oldPrice: insertProduct.oldPrice === undefined ? null : insertProduct.oldPrice,
        isNew: insertProduct.isNew === undefined ? false : insertProduct.isNew,
        hasDiscount: insertProduct.hasDiscount === undefined ? false : insertProduct.hasDiscount,
        isBestseller: insertProduct.isBestseller === undefined ? false : insertProduct.isBestseller,
        rating: 0,
        salesCount: 0
      };
      
      const [product] = await tx.insert(products).values(productToInsert).returning();
      
      // Update store product count
      const [store] = await tx.select().from(stores).where(eq(stores.id, insertProduct.storeId));
      if (store) {
        const newCount = (store.productCount || 0) + 1;
        await tx.update(stores)
          .set({ productCount: newCount })
          .where(eq(stores.id, store.id));
      }
      
      return product;
    });
  }
  
  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }
  
  async getReviews(): Promise<Review[]> {
    return db.select().from(reviews);
  }
  
  async getFeaturedReviews(limit = 3): Promise<Review[]> {
    // Sort by likes and return top reviews, with null likes treated as 0
    return db.select().from(reviews)
      .orderBy(sql`COALESCE(${reviews.likes}, 0) DESC`)
      .limit(limit);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values({
      ...insertReview,
      likes: 0,
      comments: 0
    }).returning();
    return review;
  }
  
  // Payment Methods
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    const [paymentMethod] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    return paymentMethod || undefined;
  }
  
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return db.select().from(paymentMethods);
  }
  
  async createPaymentMethod(insertPaymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const paymentMethodToInsert = {
      ...insertPaymentMethod,
      isActive: insertPaymentMethod.isActive === undefined ? true : insertPaymentMethod.isActive
    };
    const [paymentMethod] = await db.insert(paymentMethods).values(paymentMethodToInsert).returning();
    return paymentMethod;
  }
  
  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }
  
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const categoryToInsert = {
      ...insertCategory,
      isActive: insertCategory.isActive === undefined ? true : insertCategory.isActive
    };
    const [category] = await db.insert(categories).values(categoryToInsert).returning();
    return category;
  }
  
  // Advertisements
  async getAdvertisement(id: number): Promise<Advertisement | undefined> {
    const [advertisement] = await db.select().from(advertisements).where(eq(advertisements.id, id));
    return advertisement || undefined;
  }
  
  async getAdvertisements(): Promise<Advertisement[]> {
    return db.select().from(advertisements);
  }
  
  async getActiveAdvertisements(): Promise<Advertisement[]> {
    return db.select().from(advertisements).where(eq(advertisements.isActive, true));
  }
  
  async createAdvertisement(insertAdvertisement: InsertAdvertisement): Promise<Advertisement> {
    const adToInsert = {
      ...insertAdvertisement,
      link: insertAdvertisement.link === undefined ? null : insertAdvertisement.link,
      isActive: insertAdvertisement.isActive === undefined ? true : insertAdvertisement.isActive
    };
    const [advertisement] = await db.insert(advertisements).values(adToInsert).returning();
    return advertisement;
  }
}

// تغيير هذا لاستخدام قاعدة البيانات بدلاً من الذاكرة
export const storage = new MemStorage();
