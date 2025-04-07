import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useToast } from '@/hooks/use-toast';

const PaymentSubscription = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activePaymentMethod) {
      toast({
        title: "خطأ في الدفع",
        description: "يرجى اختيار طريقة دفع",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "تم الدفع بنجاح!",
        description: "تم تفعيل اشتراك متجرك لمدة شهر",
      });
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">الاشتراك في خدمة المتاجر</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h2 className="text-lg font-medium mb-4">تفاصيل الاشتراك</h2>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-textMedium">نوع الاشتراك:</span>
                    <span className="font-medium">اشتراك شهري</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-textMedium">المدة:</span>
                    <span className="font-medium">شهر واحد</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-textMedium">التجديد:</span>
                    <span className="font-medium">تلقائي</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-textMedium">تاريخ الانتهاء:</span>
                    <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>المبلغ الإجمالي:</span>
                    <span className="text-primary">$5.00</span>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-3 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">ملاحظة:</h3>
                  <p className="text-sm text-textMedium">
                    يمكنك إلغاء الاشتراك في أي وقت من خلال لوحة التحكم الخاصة بك. لن يتم تجديد الاشتراك تلقائيًا في حال الإلغاء.
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h2 className="text-lg font-medium mb-4">اختر طريقة الدفع</h2>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-3 mb-6">
                    <div 
                      className={`border rounded-lg p-3 flex items-center cursor-pointer ${activePaymentMethod === 'credit-card' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setActivePaymentMethod('credit-card')}
                    >
                      <div className="mr-3 flex-shrink-0">
                        <i className="far fa-credit-card text-xl text-textDark"></i>
                      </div>
                      <div>
                        <p className="font-medium">بطاقة الائتمان</p>
                        <div className="flex space-x-1 space-x-reverse mt-1">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5" />
                        </div>
                      </div>
                      <div className="mr-auto">
                        <div className={`w-5 h-5 rounded-full border ${activePaymentMethod === 'credit-card' ? 'border-primary' : 'border-gray-300'} flex items-center justify-center`}>
                          {activePaymentMethod === 'credit-card' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 flex items-center cursor-pointer ${activePaymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setActivePaymentMethod('paypal')}
                    >
                      <div className="mr-3 flex-shrink-0">
                        <i className="fab fa-paypal text-xl text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                      </div>
                      <div className="mr-auto">
                        <div className={`w-5 h-5 rounded-full border ${activePaymentMethod === 'paypal' ? 'border-primary' : 'border-gray-300'} flex items-center justify-center`}>
                          {activePaymentMethod === 'paypal' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 flex items-center cursor-pointer ${activePaymentMethod === 'bank-transfer' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setActivePaymentMethod('bank-transfer')}
                    >
                      <div className="mr-3 flex-shrink-0">
                        <i className="fas fa-university text-xl text-textDark"></i>
                      </div>
                      <div>
                        <p className="font-medium">تحويل بنكي</p>
                      </div>
                      <div className="mr-auto">
                        <div className={`w-5 h-5 rounded-full border ${activePaymentMethod === 'bank-transfer' ? 'border-primary' : 'border-gray-300'} flex items-center justify-center`}>
                          {activePaymentMethod === 'bank-transfer' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-textDark font-medium py-3 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    disabled={!activePaymentMethod || isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-textDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري معالجة الدفع...
                      </span>
                    ) : 'إتمام الدفع الآن'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-textMedium">
                    بالضغط على زر "إتمام الدفع الآن"، فإنك توافق على{' '}
                    <a href="#" className="text-primary hover:underline">شروط الخدمة</a>{' '}
                    و <a href="#" className="text-primary hover:underline">سياسة الاشتراك</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default PaymentSubscription;
