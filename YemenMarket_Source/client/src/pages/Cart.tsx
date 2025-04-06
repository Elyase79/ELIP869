import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItem, Product } from "@shared/schema";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";

// مكون عنصر السلة
const CartItemComponent = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: CartItem & { product: Product }, 
  onUpdateQuantity: (id: number, newQuantity: number) => void,
  onRemove: (id: number) => void
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-4 border-b border-gray-100">
      <div className="md:w-1/6 mb-3 md:mb-0">
        <div 
          className="w-24 h-24 bg-center bg-cover rounded-md border border-gray-100" 
          style={{ backgroundImage: `url(${item.product.image})` }}
        />
      </div>
      
      <div className="md:w-3/6 md:ml-4 mb-3 md:mb-0">
        <Link href={`/product/${item.product.id}`}>
          <a className="text-textDark hover:text-primary font-medium">{item.product.name}</a>
        </Link>
        <p className="text-textMedium text-sm mt-1">
          {item.product.description && item.product.description.length > 70 
            ? `${item.product.description.substring(0, 70)}...` 
            : item.product.description}
        </p>
        <div className="mt-1">
          <span className="text-primary font-medium">{item.product.price} $</span>
          {item.product.oldPrice && (
            <span className="line-through text-textLight text-sm mr-2">{item.product.oldPrice} $</span>
          )}
        </div>
      </div>
      
      <div className="md:w-1/6 mb-3 md:mb-0">
        <div className="flex items-center border border-gray-200 rounded-md">
          <button 
            className="px-3 py-1 text-textMedium hover:text-primary transition"
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            aria-label="تقليل الكمية"
          >
            <Minus size={16} />
          </button>
          <span className="px-3 py-1 border-r border-l border-gray-200 min-w-[40px] text-center">
            {item.quantity}
          </span>
          <button 
            className="px-3 py-1 text-textMedium hover:text-primary transition"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="زيادة الكمية"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="md:w-1/6 text-left text-textDark font-medium mb-3 md:mb-0">
        {(item.product.price * item.quantity).toFixed(2)} $
      </div>
      
      <div className="md:w-1/6 text-left">
        <button 
          className="text-red-500 hover:text-red-600 transition p-1"
          onClick={() => onRemove(item.id)}
          aria-label="إزالة من السلة"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const Cart = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isEmptyCart, setIsEmptyCart] = useState(false);

  // جلب محتويات السلة
  const { data: cartItems, isLoading, error } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart"],
    staleTime: 1000 * 60 * 2, // 2 دقيقة
  });

  // تنفيذ الطلب
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/checkout", {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: "سيتم توجيهك إلى صفحة الدفع",
      });
      navigate(`/checkout/${data.orderId}`);
    },
    onError: () => {
      toast({
        title: "فشل إنشاء الطلب",
        description: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  // تحديث كمية منتج
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/items/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "تم تحديث السلة",
        description: "تم تحديث كمية المنتج بنجاح",
      });
    }
  });

  // إزالة منتج من السلة
  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "تمت الإزالة",
        description: "تمت إزالة المنتج من السلة بنجاح",
      });
    }
  });

  // حساب المجموع
  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  // هل السلة فارغة؟
  useEffect(() => {
    if (cartItems && cartItems.length === 0) {
      setIsEmptyCart(true);
    } else {
      setIsEmptyCart(false);
    }
  }, [cartItems]);

  if (error) {
    toast({
      title: "خطأ في تحميل السلة",
      description: "حدث خطأ أثناء تحميل محتويات السلة. يرجى تحديث الصفحة.",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">سلة التسوق</h1>
          <div className="flex items-center text-textMedium text-sm mt-1">
            <Link href="/">
              <a className="hover:text-primary">الرئيسية</a>
            </Link>
            <span className="mx-2">/</span>
            <span>سلة التسوق</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 space-x-reverse py-4 border-b border-gray-100">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            ))}
          </div>
        ) : isEmptyCart ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 text-textLight">
              <ShoppingBag size={80} className="mx-auto" />
            </div>
            <h2 className="text-xl font-bold mb-2">سلة التسوق فارغة</h2>
            <p className="text-textMedium mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.</p>
            <Link href="/categories">
              <a className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-textDark rounded-md transition">
                <ArrowRight size={16} className="ml-1" />
                تسوق الآن
              </a>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="hidden md:flex font-medium text-textDark border-b border-gray-200 pb-2 mb-2">
              <div className="md:w-1/6">المنتج</div>
              <div className="md:w-3/6 md:ml-4">التفاصيل</div>
              <div className="md:w-1/6">الكمية</div>
              <div className="md:w-1/6 text-left">المجموع</div>
              <div className="md:w-1/6 text-left">حذف</div>
            </div>
            
            {cartItems?.map((item) => (
              <CartItemComponent 
                key={item.id} 
                item={item} 
                onUpdateQuantity={(id, quantity) => updateQuantityMutation.mutate({ id, quantity })}
                onRemove={(id) => removeItemMutation.mutate(id)}
              />
            ))}
            
            <div className="mt-8 md:mt-10 md:flex md:justify-between md:items-start flex-wrap">
              <div className="mb-6 md:mb-0 md:w-1/2 lg:w-1/3">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-bold mb-3">لديك كوبون خصم؟</h3>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="أدخل رمز الكوبون" 
                      className="flex-grow p-2 border border-gray-200 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                    <Button className="bg-primary hover:bg-primary/90 text-textDark rounded-l-md rounded-r-none">
                      تطبيق
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 lg:w-2/5">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-bold mb-3">ملخص الطلب</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-textMedium">المجموع الفرعي:</span>
                      <span className="font-medium">{calculateTotal().toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-textMedium">الشحن:</span>
                      <span className="font-medium">10.00 $</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-textMedium">الضريبة (5%):</span>
                      <span className="font-medium">{(calculateTotal() * 0.05).toFixed(2)} $</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>الإجمالي:</span>
                      <span className="text-primary">
                        {(calculateTotal() + 10 + (calculateTotal() * 0.05)).toFixed(2)} $
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-textDark"
                    onClick={() => checkoutMutation.mutate()}
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري التنفيذ...
                      </span>
                    ) : 'إتمام الطلب'}
                  </Button>
                  
                  <div className="mt-3 text-center text-sm text-textMedium">
                    <p>أو</p>
                    <Link href="/categories">
                      <a className="text-primary hover:underline">متابعة التسوق</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* نصائح للتسوق */}
        <div className="mt-8 bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="min-w-[24px] text-primary mr-2 mt-1">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-2">معلومات هامة حول التسوق</h3>
              <ul className="list-disc list-inside space-y-1 text-textMedium text-sm mr-4">
                <li>أسعار المنتجات تشمل ضريبة القيمة المضافة حيثما ينطبق ذلك</li>
                <li>التوصيل داخل المدن الرئيسية يستغرق 1-3 أيام عمل</li>
                <li>يمكنك تتبع طلبك من صفحة "طلباتي" بعد إتمام عملية الشراء</li>
                <li>لمزيد من المعلومات حول سياسات الإرجاع والاستبدال، يرجى زيارة صفحة الشروط والأحكام</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Cart;