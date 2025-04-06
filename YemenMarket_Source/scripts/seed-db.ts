import { db } from "../server/db";
import {
  users,
  stores,
  products,
  reviews,
  paymentMethods,
  categories,
  advertisements
} from "../shared/schema";

// هذا السكريبت يستخدم لإضافة بيانات تجريبية إلى قاعدة البيانات
async function seedDatabase() {
  console.log("بدء إضافة البيانات التجريبية...");

  try {
    // إضافة المستخدمين
    const [user1] = await db.insert(users).values({
      username: "mohammed",
      password: "password123",
      name: "محمد أحمد",
      email: "mohammed@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      phone: "+967123456789",
      isVerified: true
    }).returning();

    const [user2] = await db.insert(users).values({
      username: "sara",
      password: "password123",
      name: "سارة محمد",
      email: "sara@example.com",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      phone: "+967987654321",
      isVerified: true
    }).returning();

    const [user3] = await db.insert(users).values({
      username: "khaled",
      password: "password123",
      name: "خالد العمري",
      email: "khaled@example.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      phone: "+967456789123",
      isVerified: true
    }).returning();

    console.log("✅ تم إضافة المستخدمين بنجاح");

    // إضافة المتاجر
    const [store1] = await db.insert(stores).values({
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
    }).returning();

    const [store2] = await db.insert(stores).values({
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
    }).returning();

    const [store3] = await db.insert(stores).values({
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
    }).returning();

    const [store4] = await db.insert(stores).values({
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
    }).returning();

    console.log("✅ تم إضافة المتاجر بنجاح");

    // إضافة المنتجات
    await db.insert(products).values([
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      }
    ]);

    console.log("✅ تم إضافة المنتجات بنجاح");

    // إضافة التقييمات
    await db.insert(reviews).values([
      {
        userId: user1.id,
        content: "تجربة رائعة مع المنصة، سهولة في التصفح والشراء وسرعة في التوصيل. أنصح الجميع بتجربتها!",
        rating: 5,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        likes: 24,
        comments: 3
      },
      {
        userId: user2.id,
        content: "المنتجات ذات جودة عالية والأسعار معقولة. التوصيل كان متأخراً قليلاً لكن خدمة العملاء كانت متعاونة جداً.",
        rating: 4,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 18,
        comments: 5
      },
      {
        userId: user3.id,
        content: "أفضل منصة للتسوق اليمني! وجدت كل ما أحتاجه بسهولة والدفع آمن وسريع. سأستمر بالشراء منها بالتأكيد.",
        rating: 5,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        likes: 42,
        comments: 7
      }
    ]);

    console.log("✅ تم إضافة التقييمات بنجاح");

    // إضافة وسائل الدفع
    await db.insert(paymentMethods).values([
      {
        name: "Visa",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
        isActive: true
      },
      {
        name: "Mastercard",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
        isActive: true
      },
      {
        name: "PayPal",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
        isActive: true
      },
      {
        name: "Apple Pay",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg",
        isActive: true
      },
      {
        name: "كاش يمن",
        image: "https://seeklogo.com/images/C/cash-yemen-logo-7914948DDD-seeklogo.com.png",
        isActive: true
      },
      {
        name: "موبايل موني",
        image: "https://play-lh.googleusercontent.com/hpaiSs4-c__H5YQyA25K2t1nx2m_ORsX7ZMNxjg3QWcuRGCCLlJaD8tJGHNn6fymTKY",
        isActive: true
      }
    ]);

    console.log("✅ تم إضافة وسائل الدفع بنجاح");

    // إضافة الفئات
    await db.insert(categories).values([
      {
        name: "الإلكترونيات",
        icon: "mobile",
        isActive: true
      },
      {
        name: "الموضة والملابس",
        icon: "shirt",
        isActive: true
      },
      {
        name: "المنزل والمطبخ",
        icon: "home",
        isActive: true
      },
      {
        name: "الصحة والجمال",
        icon: "smile",
        isActive: true
      },
      {
        name: "الطعام والبقالة",
        icon: "utensils",
        isActive: true
      }
    ]);

    console.log("✅ تم إضافة الفئات بنجاح");

    // إضافة الإعلانات
    await db.insert(advertisements).values([
      {
        title: "عروض رمضان الحصرية",
        description: "خصومات كبيرة على جميع المنتجات خلال شهر رمضان المبارك",
        image: "https://images.unsplash.com/photo-1562585195-97aff3636dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
        link: "/offers/ramadan",
        isActive: true
      },
      {
        title: "تخفيضات نهاية الموسم",
        description: "خصومات تصل إلى 70% على ملابس الصيف",
        image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2215&q=80",
        link: "/offers/summer-sale",
        isActive: true
      },
      {
        title: "العودة إلى المدارس",
        description: "كل ما يحتاجه طفلك للعام الدراسي الجديد",
        image: "https://images.unsplash.com/photo-1605741695909-6b32eed6c8bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2680&q=80",
        link: "/offers/back-to-school",
        isActive: true
      }
    ]);

    console.log("✅ تم إضافة الإعلانات بنجاح");
    
    console.log("✅ تم إضافة جميع البيانات التجريبية بنجاح");
  } catch (error) {
    console.error("❌ حدث خطأ أثناء إضافة البيانات التجريبية:", error);
  }
}

seedDatabase();