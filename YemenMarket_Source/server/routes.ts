import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// وظائف للتحقق من تسجيل الدخول بواسطة وسائل التواصل الاجتماعي
async function validateSocialLogin(provider: string, token: string): Promise<{ valid: boolean, userData?: any }> {
  try {
    // هذه الدالة ستكون مسؤولة عن التحقق من صحة توكن التسجيل الاجتماعي
    // في التطبيق الحقيقي، سنتحقق من التوكن مع مزود الخدمة (Google, Facebook, Twitter)
    // ولكن لأغراض العرض، سنقوم بتقديم مثال مبسط
    
    console.log(`Validating ${provider} login with token: ${token.substring(0, 10)}...`);
    
    // محاكاة استجابة صحيحة
    return {
      valid: true,
      userData: {
        id: `${provider}_user_123`,
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
      }
    };
  } catch (error) {
    console.error(`Error validating ${provider} login:`, error);
    return { valid: false };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // الحصول على المنتجات المخفضة
  app.get("/api/products/offers", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      // عرض المنتجات التي تحتوي على سعر قديم (oldPrice) وهو ما يشير إلى وجود تخفيض
      const onSaleProducts = products.filter(product => product.oldPrice !== null);
      res.json(onSaleProducts);
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ في جلب المنتجات المخفضة" });
    }
  });
  // Users API
  app.get('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post('/api/users/register', async (req, res) => {
    try {
      // إنشاء المستخدم الجديد
      const newUser = await storage.createUser(req.body);
      
      // عدم إرجاع كلمة المرور
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error in register:', error);
      res.status(400).json({ message: 'Failed to create user' });
    }
  });
  
  app.post('/api/users/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // عدم إرجاع كلمة المرور
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  });
  
  // واجهة برمجة التطبيق للتسجيل عبر وسائل التواصل الاجتماعي
  app.post('/api/users/social-login', async (req, res) => {
    try {
      const { provider, token } = req.body;
      
      if (!provider || !token) {
        return res.status(400).json({ message: 'Provider and token are required' });
      }
      
      // التحقق من توكن مزود الخدمة (Google, Facebook, Twitter)
      const validation = await validateSocialLogin(provider, token);
      
      if (!validation.valid || !validation.userData) {
        return res.status(401).json({ message: 'Invalid social login credentials' });
      }
      
      // البحث عن المستخدم أو إنشاء حساب جديد
      let user = await storage.getUserByUsername(`${provider}_${validation.userData.id}`);
      
      if (!user) {
        // إنشاء مستخدم جديد إذا لم يكن موجوداً
        user = await storage.createUser({
          username: `${provider}_${validation.userData.id}`,
          password: Math.random().toString(36).substring(2, 15), // كلمة مرور عشوائية
          name: validation.userData.name,
          email: validation.userData.email,
          // تخزين معلومات المصدر الاجتماعي في حقل الملاحظة
          address: `Social Login via ${provider}`
        });
      }
      
      // عدم إرجاع كلمة المرور
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error in social login:', error);
      res.status(500).json({ message: 'Error during social login' });
    }
  });
  
  // Stores API
  app.get('/api/stores', async (req, res) => {
    const stores = await storage.getStores();
    res.json(stores);
  });
  
  app.get('/api/stores/featured', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const stores = await storage.getFeaturedStores(limit);
    res.json(stores);
  });
  
  app.get('/api/stores/:id', async (req, res) => {
    const storeId = parseInt(req.params.id);
    const store = await storage.getStore(storeId);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(store);
  });
  
  app.post('/api/stores', async (req, res) => {
    try {
      const newStore = await storage.createStore(req.body);
      res.status(201).json(newStore);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create store' });
    }
  });
  
  app.post('/api/stores/:id/subscribe', async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }
      
      // Set subscription for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      const updatedStore = await storage.updateStoreSubscription(storeId, true, expiryDate);
      res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: 'Failed to subscribe' });
    }
  });
  
  // معالج تحسين ملف البائع بنقرة واحدة
  app.post('/api/stores/:id/optimize', async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }
      
      // الحصول على التحسينات المطلوبة من body
      const optimizations = req.body;
      
      const optimizedStore = await storage.optimizeStore(storeId, optimizations);
      res.json(optimizedStore);
    } catch (error) {
      console.error('Error in store optimization:', error);
      res.status(400).json({ message: 'Failed to optimize store profile' });
    }
  });
  
  // Products API
  app.get('/api/products', async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });
  
  app.get('/api/products/featured', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const products = await storage.getFeaturedProducts(limit);
    res.json(products);
  });
  
  app.get('/api/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  });
  
  app.get('/api/stores/:storeId/products', async (req, res) => {
    const storeId = parseInt(req.params.storeId);
    const products = await storage.getProductsByStore(storeId);
    res.json(products);
  });
  
  app.post('/api/products', async (req, res) => {
    try {
      const newProduct = await storage.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create product' });
    }
  });
  
  // Reviews API
  app.get('/api/reviews', async (req, res) => {
    const reviews = await storage.getReviews();
    res.json(reviews);
  });
  
  app.get('/api/reviews/featured', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const reviews = await storage.getFeaturedReviews(limit);
    res.json(reviews);
  });
  
  app.get('/api/reviews/:id', async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = await storage.getReview(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  });
  
  app.post('/api/reviews', async (req, res) => {
    try {
      const newReview = await storage.createReview(req.body);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create review' });
    }
  });
  
  // Payment Methods API
  app.get('/api/payment-methods', async (req, res) => {
    const paymentMethods = await storage.getPaymentMethods();
    res.json(paymentMethods);
  });
  
  // Categories API
  app.get('/api/categories', async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });
  
  // Advertisements API
  app.get('/api/advertisements', async (req, res) => {
    const advertisements = await storage.getActiveAdvertisements();
    res.json(advertisements);
  });

  const httpServer = createServer(app);

  return httpServer;
}
