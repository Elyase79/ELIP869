import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";
import { Link } from "wouter";

// مكون بطاقة المنتج المبسط للصفحة
const SimpleProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100">
    <div className="relative">
      <Link href={`/product/${product.id}`}>
        <a className="block h-48 overflow-hidden">
          <div 
            className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          
          {/* علامة الخصم */}
          {product.oldPrice && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% خصم
            </div>
          )}
        </a>
      </Link>
    </div>
    
    <div className="p-4">
      <Link href={`/product/${product.id}`}>
        <a className="block">
          <h3 className="font-medium text-textDark hover:text-primary transition line-clamp-1">
            {product.name}
          </h3>
          <p className="text-textMedium text-sm mt-1 line-clamp-2 h-10">
            {product.description}
          </p>
        </a>
      </Link>
      
      <div className="mt-2 flex justify-between items-center">
        <div>
          <span className="font-medium text-primary">{product.price} $</span>
          {product.oldPrice && (
            <span className="text-textLight text-sm line-through mr-2">{product.oldPrice} $</span>
          )}
        </div>
        
        {product.rating !== undefined && (
          <div className="flex items-center text-sm">
            <span className="text-yellow-500">★</span>
            <span className="mr-1">{product.rating}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Offers = () => {
  const { toast } = useToast();

  // تحميل العروض والمنتجات المخفضة
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products/offers"],
    staleTime: 1000 * 60 * 5, // تحديث كل 5 دقائق
  });

  // استخدام useEffect للتعامل مع الأخطاء لتجنب الحلقات اللانهائية
  useEffect(() => {
    if (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحميل العروض. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">العروض الخاصة</h1>
          <p className="text-textMedium">اكتشف أفضل العروض والخصومات لدينا</p>
        </div>

        {/* بانر العروض الرئيسية */}
        <div className="mb-8 bg-gradient-to-l from-yellow-500/20 to-yellow-500/10 p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2">خصومات مذهلة هذا الأسبوع!</h2>
              <p className="text-textDark mb-4">وفر حتى 50% على مجموعة مختارة من المنتجات المميزة</p>
              <Link href="/categories">
                <a className="bg-primary hover:bg-primary/90 text-textDark py-2 px-4 rounded-md inline-block transition">
                  تسوق الآن
                </a>
              </Link>
            </div>
            <div className="w-40 h-40 md:w-48 md:h-48 bg-contain bg-center bg-no-repeat" 
                 style={{backgroundImage: "url('https://img.icons8.com/bubbles/200/sale.png')"}}>
            </div>
          </div>
        </div>
        
        {/* قائمة المنتجات */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 border-r-4 border-primary pr-4">منتجات مخفضة</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <Skeleton className="w-full h-40 mb-3 rounded-md" />
                  <Skeleton className="w-3/4 h-5 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-4" />
                  <Skeleton className="w-1/3 h-8" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {products.map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-textMedium mb-4">لا توجد عروض متاحة حاليًا</p>
                  <Link href="/categories">
                    <a className="text-primary hover:underline">تصفح كل المنتجات</a>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* نصائح للتسوق */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-3">نصائح للتسوق الذكي</h3>
          <ul className="list-disc list-inside space-y-2 text-textMedium mr-4">
            <li>قارن أسعار المنتجات بين المتاجر المختلفة للحصول على أفضل قيمة</li>
            <li>راجع تقييمات العملاء السابقين قبل الشراء</li>
            <li>اشترك في نشرتنا البريدية للحصول على آخر العروض والخصومات</li>
            <li>استخدم أدوات البحث والتصفية للعثور على المنتجات المناسبة بسرعة</li>
          </ul>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Offers;