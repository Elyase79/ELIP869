import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter } from 'lucide-react';

const registerSchema = z.object({
  username: z.string().min(3, { message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  name: z.string().min(2, { message: 'الاسم يجب أن يكون حرفين على الأقل' }),
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await apiRequest('POST', '/api/users/register', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "يمكنك الآن تسجيل الدخول باستخدام بياناتك",
      });
      navigate('/login');
    },
    onError: () => {
      toast({
        title: "فشل إنشاء الحساب",
        description: "قد يكون اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل",
        variant: "destructive",
      });
    }
  });

  // Functions for social media registration
  const socialLoginMutation = useMutation({
    mutationFn: async ({ provider, token }: { provider: string, token: string }) => {
      const res = await apiRequest('POST', '/api/users/social-login', { provider, token });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء الحساب والتسجيل بنجاح!",
        description: `مرحباً بك ${data.name}`,
      });
      navigate('/');
    },
    onError: () => {
      toast({
        title: "فشل إنشاء الحساب",
        description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const registerWithGoogle = () => {
    toast({
      title: "جاري التسجيل",
      description: "إنشاء حساب بواسطة Google",
    });
    // In a real implementation, we would get a token from Google OAuth
    // For demo purposes, we'll use a mock token
    socialLoginMutation.mutate({ provider: 'google', token: 'google_mock_token_456' });
  };

  const registerWithFacebook = () => {
    toast({
      title: "جاري التسجيل",
      description: "إنشاء حساب بواسطة Facebook",
    });
    // In a real implementation, we would get a token from Facebook OAuth
    // For demo purposes, we'll use a mock token
    socialLoginMutation.mutate({ provider: 'facebook', token: 'facebook_mock_token_456' });
  };

  const registerWithTwitter = () => {
    toast({
      title: "جاري التسجيل",
      description: "إنشاء حساب بواسطة Twitter",
    });
    // In a real implementation, we would get a token from Twitter OAuth
    // For demo purposes, we'll use a mock token
    socialLoginMutation.mutate({ provider: 'twitter', token: 'twitter_mock_token_456' });
  };

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
            <p className="text-textMedium text-sm">انضم إلى سوق اليمن واستمتع بتجربة تسوق فريدة</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسمك الكامل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم المستخدم" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="أدخل بريدك الإلكتروني" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رقم هاتفك" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="أدخل كلمة المرور" 
                          {...field} 
                        />
                        <button 
                          type="button"
                          className="absolute top-1/2 left-3 transform -translate-y-1/2 text-textMedium"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="ml-2" required />
                <label htmlFor="terms" className="text-textMedium text-sm">
                  أوافق على <Link href="/terms"><a className="text-primary hover:underline">الشروط والأحكام</a></Link> و <Link href="/privacy"><a className="text-primary hover:underline">سياسة الخصوصية</a></Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-textDark hover:bg-primary/90"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التسجيل...
                  </span>
                ) : 'إنشاء حساب'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-textMedium text-sm">
              لديك حساب بالفعل؟{' '}
              <Link href="/login">
                <a className="text-primary hover:underline">تسجيل الدخول</a>
              </Link>
            </p>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-textMedium">أو التسجيل عبر</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button 
              type="button"
              onClick={registerWithGoogle}
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.804A7.194 7.194 0 0 1 12 4.996c1.97 0 3.744.822 5.016 2.134l4.208-4.131C19.203 1.14 15.922 0 12 0 7.398 0 3.431 2.716 1.387 6.777l3.879 3.027z"/>
                <path fill="#4285F4" d="M16.845 18.043c-1.32.868-3.03 1.382-4.845 1.382-3.098 0-5.725-1.674-7.152-4.114L.951 18.305C3.016 22.31 7.183 24.85 12 24.85c3.604 0 6.699-1.262 8.95-3.392l-4.105-3.415z"/>
                <path fill="#FBBC05" d="M4.848 15.311A7.153 7.153 0 0 1 4.35 12c0-1.151.278-2.237.766-3.2L1.387 6.777A11.799 11.799 0 0 0 .17 12c0 1.867.446 3.634 1.231 5.204l3.447-1.893z"/>
                <path fill="#34A853" d="M12 19.425c2.029 0 3.884-.624 5.267-1.647l4.105 3.415c-2.269 2.095-5.506 3.404-9.372 3.404-4.818 0-8.984-2.54-11.049-6.546l3.848-2.993C6.275 17.751 8.902 19.425 12 19.425z"/>
              </svg>
            </button>
            <button 
              type="button"
              onClick={registerWithFacebook}
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Facebook size={20} className="text-[#1877F2]" />
            </button>
            <button 
              type="button"
              onClick={registerWithTwitter}
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Twitter size={20} className="text-[#1DA1F2]" />
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Register;
