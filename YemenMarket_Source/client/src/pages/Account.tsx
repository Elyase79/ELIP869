import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Order } from "@shared/schema";
import { 
  UserCircle, 
  Package, 
  Heart, 
  CreditCard, 
  Settings, 
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

// واجهة حالة طلب مع معلومات إضافية
interface OrderWithDetails extends Order {
  statusText: string;
  statusIcon: React.ReactNode;
  statusColor: string;
  itemCount: number;
}

// تحويل حالة الطلب إلى نص وأيقونة
const getOrderStatusDetails = (status: string): { text: string; icon: React.ReactNode; color: string } => {
  switch (status) {
    case "pending":
      return { 
        text: "قيد الانتظار", 
        icon: <Clock className="inline-block w-5 h-5 ml-1" />, 
        color: "text-orange-500"
      };
    case "processing":
      return { 
        text: "قيد المعالجة", 
        icon: <Clock className="inline-block w-5 h-5 ml-1" />, 
        color: "text-blue-500" 
      };
    case "shipped":
      return { 
        text: "تم الشحن", 
        icon: <Package className="inline-block w-5 h-5 ml-1" />, 
        color: "text-purple-500" 
      };
    case "delivered":
      return { 
        text: "تم التوصيل", 
        icon: <CheckCircle className="inline-block w-5 h-5 ml-1" />, 
        color: "text-green-500" 
      };
    case "cancelled":
      return { 
        text: "تم الإلغاء", 
        icon: <XCircle className="inline-block w-5 h-5 ml-1" />, 
        color: "text-red-500" 
      };
    default:
      return { 
        text: "غير معروفة", 
        icon: <Clock className="inline-block w-5 h-5 ml-1" />, 
        color: "text-gray-500" 
      };
  }
};

// مكون عرض تفاصيل المستخدم
const UserProfile = ({ user }: { user: User }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || ""
  });
  const { toast } = useToast();

  // تحديث بيانات المستخدم
  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/users/${user.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات حسابك بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "فشل التحديث",
        description: "حدث خطأ أثناء تحديث معلومات حسابك",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تحرير الملف الشخصي</CardTitle>
          <CardDescription>قم بتحديث معلومات حسابك الشخصية</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">الاسم</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">رقم الهاتف</label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">العنوان</label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="w-full"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={updateUserMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-textDark"
            >
              {updateUserMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الحفظ...
                </span>
              ) : 'حفظ التغييرات'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>معلومات الملف الشخصي</CardTitle>
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            size="sm"
          >
            تعديل
          </Button>
        </div>
        <CardDescription>تفاصيل حسابك الشخصية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center">
            <UserCircle className="w-16 h-16 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-textLight mb-1">اسم المستخدم</h4>
              <p className="text-textDark">{user.username}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-textLight mb-1">الاسم</h4>
              <p className="text-textDark">{user.name || "غير محدد"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-textLight mb-1">البريد الإلكتروني</h4>
              <p className="text-textDark">{user.email || "غير محدد"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-textLight mb-1">رقم الهاتف</h4>
              <p className="text-textDark">{user.phone || "غير محدد"}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-textLight mb-1">العنوان</h4>
            <p className="text-textDark">{user.address || "غير محدد"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// مكون عرض الطلبات
const UserOrders = () => {
  const { toast } = useToast();

  // استعلام للحصول على الطلبات
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["/api/orders/user"],
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });

  // تحويل الطلبات إلى النموذج المعدل
  const processedOrders: OrderWithDetails[] = (orders || []).map(order => {
    const { text, icon, color } = getOrderStatusDetails(order.status);
    return {
      ...order,
      statusText: text,
      statusIcon: icon,
      statusColor: color,
      itemCount: 2 // نضيف عدد العناصر التقريبي للعرض
    };
  });

  if (error) {
    toast({
      title: "خطأ في تحميل الطلبات",
      description: "لم نتمكن من تحميل طلباتك. يرجى تحديث الصفحة.",
      variant: "destructive",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>طلباتي</CardTitle>
        <CardDescription>جميع طلباتك السابقة</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/6" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-2/4" />
              </div>
            ))}
          </div>
        ) : processedOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 text-textLight">
              <ShoppingBag className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
            <p className="text-textMedium mb-4">لم تقم بأي طلبات بعد</p>
            <Link href="/categories">
              <a className="text-primary hover:underline">تسوق الآن</a>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {processedOrders.map((order) => (
              <div key={order.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                  <div>
                    <div className="font-medium">طلب #{order.orderNumber}</div>
                    <div className="text-sm text-textMedium">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : "غير محدد"}
                    </div>
                  </div>
                  <div className={`mt-2 md:mt-0 ${order.statusColor}`}>
                    {order.statusIcon}
                    <span>{order.statusText}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-textMedium">منتجات: {order.itemCount}</div>
                  <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
                </div>
                <div className="mt-3">
                  <Link href={`/order/${order.id}`}>
                    <a className="text-primary text-sm hover:underline">عرض التفاصيل</a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// مكون الإعدادات
const UserSettings = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // تسجيل الخروج
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/users/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
      navigate("/login");
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإعدادات</CardTitle>
        <CardDescription>إدارة إعدادات حسابك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">إعدادات الإشعارات</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email-notifications"
                className="ml-2"
                defaultChecked
              />
              <label htmlFor="email-notifications">تلقي إشعارات عبر البريد الإلكتروني</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms-notifications"
                className="ml-2"
                defaultChecked
              />
              <label htmlFor="sms-notifications">تلقي إشعارات عبر الرسائل النصية</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="promo-notifications"
                className="ml-2"
                defaultChecked
              />
              <label htmlFor="promo-notifications">تلقي عروض وخصومات</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">أمان الحساب</h3>
          <Button variant="outline" className="mb-2 w-full justify-start">
            تغيير كلمة المرور
          </Button>
          <Button variant="outline" className="w-full justify-start">
            تفعيل المصادقة الثنائية
          </Button>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">خيارات متقدمة</h3>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تسجيل الخروج...
              </span>
            ) : (
              <>
                <LogOut className="ml-2" size={16} />
                تسجيل الخروج
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// مكون المفضلة
const UserWishlist = () => {
  const { toast } = useToast();

  // استعلام للحصول على المفضلة
  const { data: wishlist = [], isLoading, error } = useQuery<any[]>({
    queryKey: ["/api/wishlist"],
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });

  if (error) {
    toast({
      title: "خطأ في تحميل المفضلة",
      description: "لم نتمكن من تحميل قائمة المفضلة. يرجى تحديث الصفحة.",
      variant: "destructive",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المفضلة</CardTitle>
        <CardDescription>المنتجات المحفوظة في قائمة المفضلة</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex space-x-4 space-x-reverse">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 text-textLight">
              <Heart className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium mb-2">قائمة المفضلة فارغة</h3>
            <p className="text-textMedium mb-4">لم تقم بإضافة أي منتجات إلى المفضلة بعد</p>
            <Link href="/categories">
              <a className="text-primary hover:underline">تصفح المنتجات</a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((item: any) => (
              <div key={item.id} className="group relative bg-gray-50 p-4 rounded-md flex">
                <div className="w-20 h-20 min-w-20 bg-contain bg-center bg-no-repeat rounded-md border border-gray-100" 
                     style={{ backgroundImage: `url(${item.product.image})` }}>
                </div>
                <div className="mr-4 flex-grow">
                  <Link href={`/product/${item.product.id}`}>
                    <a className="font-medium hover:text-primary transition">
                      {item.product.name}
                    </a>
                  </Link>
                  <div className="text-sm text-textMedium mt-1">
                    {item.product.description && item.product.description.length > 60 
                      ? `${item.product.description.substring(0, 60)}...` 
                      : item.product.description}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-medium text-primary">${item.product.price.toFixed(2)}</div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-textDark text-xs">
                      إضافة للسلة
                    </Button>
                  </div>
                </div>
                <button className="absolute top-2 left-2 text-red-500 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// مكون الصفحة الرئيسية
const Account = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // استعلام للحصول على بيانات المستخدم
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
  
  // التأكد من أن المستخدم مسجل دخوله
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "غير مسجل دخول",
        description: "يرجى تسجيل الدخول للوصول إلى حسابك",
      });
      navigate("/login");
    }
  }, [user, isLoading, navigate, toast]);
  
  if (error) {
    toast({
      title: "حدث خطأ",
      description: "لم نتمكن من تحميل معلومات حسابك. يرجى تحديث الصفحة.",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">حسابي</h1>
          <div className="flex items-center text-textMedium text-sm mt-1">
            <Link href="/">
              <a className="hover:text-primary">الرئيسية</a>
            </Link>
            <span className="mx-2">/</span>
            <span>حسابي</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <Skeleton className="h-10 w-full mb-6" />
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-2/4 mb-8" />
              
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            {/* القائمة الجانبية */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{user.name || user.username}</div>
                  <div className="text-sm text-textMedium">{user.email}</div>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" orientation="vertical">
                <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                  <TabsTrigger value="profile" className="justify-start">
                    <UserCircle className="ml-2 h-5 w-5" />
                    الملف الشخصي
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="justify-start">
                    <Package className="ml-2 h-5 w-5" />
                    طلباتي
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="justify-start">
                    <Heart className="ml-2 h-5 w-5" />
                    المفضلة
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="justify-start">
                    <CreditCard className="ml-2 h-5 w-5" />
                    وسائل الدفع
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="justify-start">
                    <Settings className="ml-2 h-5 w-5" />
                    الإعدادات
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500"
                  onClick={() => navigate("/login")}
                >
                  <LogOut className="ml-2 h-5 w-5" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
            
            {/* المحتوى الرئيسي */}
            <div>
              <TabsContent value="profile" className="m-0">
                <UserProfile user={user} />
              </TabsContent>
              
              <TabsContent value="orders" className="m-0">
                <UserOrders />
              </TabsContent>
              
              <TabsContent value="wishlist" className="m-0">
                <UserWishlist />
              </TabsContent>
              
              <TabsContent value="payment" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>وسائل الدفع</CardTitle>
                    <CardDescription>إدارة وسائل الدفع الخاصة بك</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 text-textLight">
                        <CreditCard className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">لا توجد وسائل دفع</h3>
                      <p className="text-textMedium mb-4">لم تقم بإضافة أي وسائل دفع بعد</p>
                      <Button className="bg-primary hover:bg-primary/90 text-textDark">
                        إضافة وسيلة دفع
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="m-0">
                <UserSettings user={user} />
              </TabsContent>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Account;