import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, { message: 'اسم المتجر يجب أن يكون 3 أحرف على الأقل' }),
  description: z.string().min(10, { message: 'الوصف يجب أن يكون 10 أحرف على الأقل' }),
  logo: z.string().url({ message: 'يرجى إدخال رابط صورة صحيح' }),
  coverImage: z.string().url({ message: 'يرجى إدخال رابط صورة صحيح' }),
  category: z.string().min(1, { message: 'يرجى اختيار فئة' }),
});

type FormData = z.infer<typeof formSchema>;

const StoreRegistration = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      coverImage: '',
      category: '',
    },
  });
  
  const createStoreMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest('POST', '/api/stores', {
        ...data,
        userId: 1, // This would normally be the logged-in user's ID
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء المتجر بنجاح!",
        description: "سيتم تحويلك إلى صفحة الدفع لإكمال الاشتراك.",
      });
      // Navigate to payment page
      setTimeout(() => {
        navigate('/payment/subscription');
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إنشاء المتجر. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: FormData) => {
    if (step === 1) {
      setStep(2);
    } else {
      createStoreMutation.mutate(data);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">إنشاء متجر جديد</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-textDark' : 'bg-gray-200 text-textMedium'}`}>
                1
              </div>
              <div className={`h-1 flex-grow mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-textDark' : 'bg-gray-200 text-textMedium'}`}>
                2
              </div>
              <div className="h-1 flex-grow mx-2 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-textMedium">
                3
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-medium mb-4">معلومات المتجر الأساسية</h2>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المتجر</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم المتجر" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وصف المتجر</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="اكتب وصفاً مختصراً لمتجرك"
                              className="h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>فئة المتجر</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                              {...field}
                            >
                              <option value="">اختر فئة</option>
                              <option value="electronics">الإلكترونيات</option>
                              <option value="fashion">الملابس والأزياء</option>
                              <option value="home">المنزل والمطبخ</option>
                              <option value="beauty">الجمال والعناية</option>
                              <option value="games">الألعاب والهوايات</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <h2 className="text-xl font-medium mb-4">صور المتجر</h2>
                    
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>شعار المتجر (رابط URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل رابط شعار المتجر" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>صورة الغلاف (رابط URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل رابط صورة الغلاف" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">ملاحظة:</h3>
                      <p className="text-sm text-textMedium">
                        في التطبيق الفعلي، سيكون هناك إمكانية لرفع الصور مباشرة بدلاً من إدخال روابط.
                        لهذا النموذج الأولي، يمكنك استخدام روابط الصور من أي مصدر عبر الإنترنت.
                      </p>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between pt-4">
                  {step > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                    >
                      السابق
                    </Button>
                  )}
                  
                  <Button 
                    type="submit"
                    className="bg-primary text-textDark hover:bg-primary/90 mr-auto"
                    disabled={createStoreMutation.isPending}
                  >
                    {createStoreMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الإنشاء...
                      </span>
                    ) : step === 1 ? 'التالي' : 'إنشاء المتجر'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">مميزات الاشتراك</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h3 className="font-medium">10 صفحات لعرض المنتجات</h3>
                  <p className="text-sm text-textMedium">عرض منتجاتك بطريقة احترافية ومنظمة</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h3 className="font-medium">إدارة المبيعات</h3>
                  <p className="text-sm text-textMedium">تتبع مبيعاتك وطلباتك بسهولة</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h3 className="font-medium">تقارير وإحصائيات</h3>
                  <p className="text-sm text-textMedium">تحليلات مفصلة عن أداء متجرك</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h3 className="font-medium">دعم فني متواصل</h3>
                  <p className="text-sm text-textMedium">مساعدة على مدار الساعة لحل أي مشاكل</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-accent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">الاشتراك الشهري</h3>
                  <p className="text-sm text-textMedium">تجديد تلقائي كل شهر</p>
                </div>
                <div className="text-xl font-bold">5$ / شهرياً</div>
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

export default StoreRegistration;
