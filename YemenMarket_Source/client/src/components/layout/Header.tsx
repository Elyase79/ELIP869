import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu,
  X,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User as UserType } from "@shared/schema";

const Header = () => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // استعلام بيانات المستخدم
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"],
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // استعلام عدد عناصر السلة
  const { data: cartItems } = useQuery<{ id: number }[]>({
    queryKey: ["/api/cart"],
    staleTime: 1000 * 60, // 1 دقيقة
  });
  
  // التحكم في عرض الهيدر عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // إغلاق القائمة المتنقلة عند تغيير الموقع
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // معالجة البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: تنفيذ البحث والتوجيه إلى صفحة النتائج
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* منطقة الجزء العلوي من الهيدر - الشعار والبحث وأيقونات المستخدم */}
        <div className="flex items-center justify-between py-4">
          {/* الشعار */}
          <div className="flex-shrink-0">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-2xl font-bold text-primary">سوق اليمن</span>
              </a>
            </Link>
          </div>
          
          {/* نموذج البحث - يظهر فقط على الشاشات المتوسطة والكبيرة */}
          <div className="hidden md:flex flex-grow max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="ابحث عن منتجات..."
                className="w-full pr-10 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                aria-label="بحث"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
          
          {/* أيقونات المستخدم */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* أيقونات تظهر فقط على الشاشات المتوسطة والكبيرة */}
            <div className="hidden md:flex items-center space-x-3 space-x-reverse">
              <Link href="/wishlist">
                <a className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition relative">
                  <Heart size={22} />
                </a>
              </Link>
              
              <Link href="/cart">
                <a className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition relative">
                  <ShoppingCart size={22} />
                  {cartItems && cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-textDark min-w-[18px] h-[18px] flex items-center justify-center p-0 text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </a>
              </Link>
              
              {user ? (
                <Link href="/account">
                  <a className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                    <User size={22} />
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="inline-flex items-center px-3 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-textDark transition">
                    <LogIn size={18} className="ml-1" />
                    <span>تسجيل الدخول</span>
                  </a>
                </Link>
              )}
            </div>
            
            {/* زر فتح/إغلاق القائمة على الجوال */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* القائمة الرئيسية - تظهر فقط على الشاشات المتوسطة والكبيرة */}
        <nav className="hidden md:block border-t border-gray-100 py-2">
          <ul className="flex space-x-8 space-x-reverse">
            <li>
              <Link href="/">
                <a className={`py-2 inline-block ${location === '/' ? 'text-primary font-medium' : 'hover:text-primary'}`}>
                  الرئيسية
                </a>
              </Link>
            </li>
            <li>
              <Link href="/categories">
                <a className={`py-2 inline-block ${location === '/categories' ? 'text-primary font-medium' : 'hover:text-primary'}`}>
                  التصنيفات
                </a>
              </Link>
            </li>
            <li>
              <Link href="/offers">
                <a className={`py-2 inline-block ${location === '/offers' ? 'text-primary font-medium' : 'hover:text-primary'}`}>
                  العروض
                </a>
              </Link>
            </li>
            <li>
              <Link href="/stores">
                <a className={`py-2 inline-block ${location === '/stores' ? 'text-primary font-medium' : 'hover:text-primary'}`}>
                  المتاجر
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a className={`py-2 inline-block ${location === '/about' ? 'text-primary font-medium' : 'hover:text-primary'}`}>
                  عن المنصة
                </a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a className={`py-2 inline-block ${location === '/contact' ? 'text-primary font-medium' : 'hover:text-primary'}`}>
                  اتصل بنا
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* القائمة المتنقلة للجوال */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            {/* البحث للجوال */}
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="text"
                placeholder="ابحث عن منتجات..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="w-full mt-2 bg-primary hover:bg-primary/90 text-textDark">
                <Search size={18} className="ml-2" />
                بحث
              </Button>
            </form>
            
            {/* روابط التنقل للجوال */}
            <nav className="mb-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <a className={`block py-2 ${location === '/' ? 'text-primary font-medium' : ''}`}>
                      الرئيسية
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/categories">
                    <a className={`block py-2 ${location === '/categories' ? 'text-primary font-medium' : ''}`}>
                      التصنيفات
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/offers">
                    <a className={`block py-2 ${location === '/offers' ? 'text-primary font-medium' : ''}`}>
                      العروض
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/stores">
                    <a className={`block py-2 ${location === '/stores' ? 'text-primary font-medium' : ''}`}>
                      المتاجر
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className={`block py-2 ${location === '/about' ? 'text-primary font-medium' : ''}`}>
                      عن المنصة
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className={`block py-2 ${location === '/contact' ? 'text-primary font-medium' : ''}`}>
                      اتصل بنا
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* أزرار المستخدم للجوال */}
            <div className="flex flex-col space-y-2">
              <Link href="/cart">
                <a className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                  <ShoppingCart size={18} className="ml-2" />
                  <span>سلة التسوق</span>
                  {cartItems && cartItems.length > 0 && (
                    <Badge className="mr-2 bg-primary text-textDark">{cartItems.length}</Badge>
                  )}
                </a>
              </Link>
              
              <Link href="/wishlist">
                <a className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                  <Heart size={18} className="ml-2" />
                  <span>المفضلة</span>
                </a>
              </Link>
              
              {user ? (
                <Link href="/account">
                  <a className="flex items-center justify-center py-2 px-4 bg-primary text-textDark rounded-md hover:bg-primary/90 transition">
                    <User size={18} className="ml-2" />
                    <span>حسابي</span>
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="flex items-center justify-center py-2 px-4 bg-primary text-textDark rounded-md hover:bg-primary/90 transition">
                    <LogIn size={18} className="ml-2" />
                    <span>تسجيل الدخول</span>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;