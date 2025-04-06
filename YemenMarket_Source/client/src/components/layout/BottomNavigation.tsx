import { Link, useLocation } from "wouter";
import { Home, Layers, Tag, ShoppingCart, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const BottomNavigation = () => {
  const [location] = useLocation();
  
  // استعلام عدد عناصر السلة
  const { data: cartItems } = useQuery<{ id: number }[]>({
    queryKey: ["/api/cart"],
    staleTime: 1000 * 60, // 1 دقيقة
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="container px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/">
            <a className={`flex flex-col items-center justify-center w-1/5 py-1 ${location === '/' ? 'text-primary' : 'text-gray-500'}`}>
              <Home size={20} />
              <span className="text-xs mt-1">الرئيسية</span>
            </a>
          </Link>
          
          <Link href="/categories">
            <a className={`flex flex-col items-center justify-center w-1/5 py-1 ${location === '/categories' ? 'text-primary' : 'text-gray-500'}`}>
              <Layers size={20} />
              <span className="text-xs mt-1">التصنيفات</span>
            </a>
          </Link>
          
          <Link href="/offers">
            <a className={`flex flex-col items-center justify-center w-1/5 py-1 ${location === '/offers' ? 'text-primary' : 'text-gray-500'}`}>
              <Tag size={20} />
              <span className="text-xs mt-1">العروض</span>
            </a>
          </Link>
          
          <Link href="/cart">
            <a className={`flex flex-col items-center justify-center w-1/5 py-1 relative ${location === '/cart' ? 'text-primary' : 'text-gray-500'}`}>
              <ShoppingCart size={20} />
              {cartItems && cartItems.length > 0 && (
                <Badge className="absolute -top-1 right-6 bg-primary text-textDark min-w-[16px] h-[16px] flex items-center justify-center p-0 text-[10px]">
                  {cartItems.length}
                </Badge>
              )}
              <span className="text-xs mt-1">السلة</span>
            </a>
          </Link>
          
          <Link href="/account">
            <a className={`flex flex-col items-center justify-center w-1/5 py-1 ${location === '/account' ? 'text-primary' : 'text-gray-500'}`}>
              <User size={20} />
              <span className="text-xs mt-1">حسابي</span>
            </a>
          </Link>
        </div>
      </div>
      
      {/* شريط أصفر في أسفل الصفحة كما طلب المستخدم */}
      <div className="h-1 bg-primary"></div>
    </div>
  );
};

export default BottomNavigation;