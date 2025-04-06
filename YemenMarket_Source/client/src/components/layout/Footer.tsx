import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكن إضافة منطق لإرسال البريد إلى الخادم
    console.log("Newsletter form submitted");
  };
  
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6 md:pb-10 mt-12 font-tajawal">
      <div className="container mx-auto px-4">
        {/* الجزء العلوي من الذيل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* معلومات المتجر */}
          <div>
            <h3 className="font-bold text-lg mb-4">سوق اليمن</h3>
            <p className="text-textMedium mb-4">
              السوق الإلكتروني الأول في اليمن، نقدم لكم أفضل المنتجات من مختلف المتاجر المحلية والعالمية.
            </p>
            <div className="mt-6">
              <h4 className="font-medium mb-3">تسوق بثقة</h4>
              <p className="text-textMedium">
                ضمان جودة المنتجات وسهولة الشراء والتوصيل السريع
              </p>
            </div>
          </div>
          
          {/* خدمة العملاء */}
          <div>
            <h3 className="font-bold text-lg mb-4">خدمة العملاء</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a className="text-textMedium hover:text-primary transition">الشروط والأحكام</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-textMedium hover:text-primary transition">سياسة الخصوصية</a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-textMedium hover:text-primary transition">سياسة الشحن</a>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <a className="text-textMedium hover:text-primary transition">سياسة الاسترجاع</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-textMedium hover:text-primary transition">الأسئلة الشائعة</a>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <a className="text-textMedium hover:text-primary transition">الدعم الفني</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* النشرة البريدية */}
          <div>
            <h3 className="font-bold text-lg mb-4">النشرة البريدية</h3>
            <p className="text-textMedium mb-4">
              اشترك في نشرتنا البريدية ليصلك كل جديد من العروض والخصومات.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="w-full"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-textDark"
              >
                اشتراك
              </Button>
            </form>
            
            {/* وسائل التواصل الاجتماعي */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">تابعنا على:</h4>
              <div className="flex space-x-3 space-x-reverse">
                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* خط فاصل */}
        <div className="border-t border-gray-100 pt-6 mt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            {/* حقوق النشر */}
            <p className="text-textMedium text-sm mb-4 md:mb-0">
              &copy; {currentYear} سوق اليمن. جميع الحقوق محفوظة.
            </p>
            
            {/* وسائل الدفع */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-sm text-textMedium ml-2">وسائل الدفع المتاحة:</span>
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" className="h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* شريط أصفر في أسفل الصفحة كما طلب المستخدم */}
      <div className="h-1 bg-primary mt-6"></div>
    </footer>
  );
};

export default Footer;