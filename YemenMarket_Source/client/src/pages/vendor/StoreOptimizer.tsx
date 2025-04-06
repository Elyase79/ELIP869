import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  Image, 
  FileText, 
  Tag, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// نوع بيانات المتجر
interface Store {
  id: number;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  isSubscribed: boolean;
  rating: number;
  productCount: number;
}

// مكون تقييم العناصر
const OptimizationCheck = ({ title, isOptimal, description, onOptimize }) => {
  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
      <div>
        {isOptimal ? (
          <CheckCircle2 className="text-green-500 w-6 h-6 mt-0.5" />
        ) : (
          <AlertTriangle className="text-amber-500 w-6 h-6 mt-0.5" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base">{title}</h3>
          {!isOptimal && (
            <Button variant="ghost" size="sm" onClick={onOptimize} className="text-primary">
              تحسين <Wand2 className="mr-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// معالج تحسين ملف المتجر الرئيسي
export default function StoreOptimizer() {
  const [location, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const storeId = parseInt(id);
  const { toast } = useToast();
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [currentTab, setCurrentTab] = useState("overview");

  // الحصول على بيانات المتجر
  const { data: store, isLoading, isError } = useQuery<Store>({
    queryKey: [`/api/stores/${storeId}`],
    enabled: !!storeId,
  });

  // تقييم مستوى التحسين عند تحميل البيانات
  useEffect(() => {
    if (store) {
      let score = 0;
      
      // التحقق من كل عنصر قابل للتحسين
      if (store.logo && !store.logo.includes("placehold.co")) score += 20;
      if (store.coverImage && !store.coverImage.includes("placehold.co")) score += 20;
      if (store.description && store.description.length >= 50) score += 20;
      if (store.category && store.category.length > 3) score += 20;
      if (store.name && store.name.length >= 5) score += 20;
      
      setOptimizationScore(score);
    }
  }, [store]);

  // واجهة برمجة التطبيقات لتحسين المتجر
  const optimizeMutation = useMutation({
    mutationFn: async (optimizations: Partial<Store>) => {
      const response = await apiRequest("POST", `/api/stores/${storeId}/optimize`, optimizations);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}`] });
      toast({
        title: "تم تحسين المتجر بنجاح",
        description: "تم تحديث بيانات المتجر بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "فشل في تحسين المتجر",
        description: "حدث خطأ أثناء محاولة تحسين المتجر",
        variant: "destructive",
      });
    }
  });

  // خاصية تحسين جميع العناصر دفعة واحدة
  const optimizeAll = () => {
    const suggestedOptimizations: Partial<Store> = {};
    
    // تحسين الشعار إذا كان افتراضيًا
    if (!store?.logo || store.logo.includes("placehold.co")) {
      suggestedOptimizations.logo = "https://random.imagecdn.app/100/100";
    }
    
    // تحسين صورة الغلاف إذا كانت افتراضية
    if (!store?.coverImage || store.coverImage.includes("placehold.co")) {
      suggestedOptimizations.coverImage = "https://random.imagecdn.app/800/300";
    }
    
    // تحسين الوصف إذا كان قصيرًا
    if (!store?.description || store.description.length < 50) {
      suggestedOptimizations.description = "متجر متخصص يقدم منتجات عالية الجودة ومختارة بعناية لتلبية احتياجات العملاء. نؤمن بتقديم خدمة متميزة وأسعار منافسة مع ضمان رضا العملاء.";
    }
    
    // تحسين الفئة إذا كانت غير محددة
    if (!store?.category || store.category.length <= 3) {
      suggestedOptimizations.category = "عام";
    }
    
    // التحسين فقط إذا كانت هناك تغييرات مطلوبة
    if (Object.keys(suggestedOptimizations).length > 0) {
      optimizeMutation.mutate(suggestedOptimizations);
    }
  };

  // تحسين عنصر محدد
  const optimizeElement = (element: string) => {
    let update: Partial<Store> = {};
    
    switch (element) {
      case "logo":
        update = { logo: "https://random.imagecdn.app/100/100" };
        break;
      case "cover":
        update = { coverImage: "https://random.imagecdn.app/800/300" };
        break;
      case "description":
        update = { description: "متجر متخصص يقدم منتجات عالية الجودة ومختارة بعناية لتلبية احتياجات العملاء. نؤمن بتقديم خدمة متميزة وأسعار منافسة مع ضمان رضا العملاء." };
        break;
      case "category":
        update = { category: "عام" };
        break;
    }
    
    optimizeMutation.mutate(update);
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">لم يتم العثور على المتجر</h2>
          <p className="text-muted-foreground mb-4">لا يمكن العثور على بيانات المتجر المطلوب</p>
          <Button onClick={() => setLocation("/vendor/dashboard")}>
            العودة إلى لوحة التحكم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* القسم الجانبي - النتيجة وملخص التحسين */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>معالج تحسين المتجر</CardTitle>
              <CardDescription>تحسين ملف متجرك بنقرة واحدة لزيادة المبيعات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">مستوى تحسين المتجر</span>
                  <span className="text-sm font-bold">{optimizationScore}%</span>
                </div>
                <Progress value={optimizationScore} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  <span className="text-sm">الصور والشعار</span>
                  {(store.logo && store.coverImage && 
                    !store.logo.includes("placehold.co") && 
                    !store.coverImage.includes("placehold.co")) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-auto" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-auto" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm">الوصف</span>
                  {(store.description && store.description.length >= 50) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-auto" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-auto" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="text-sm">التصنيف</span>
                  {(store.category && store.category.length > 3) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-auto" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-auto" />
                  )}
                </div>
              </div>
              
              <Button 
                onClick={optimizeAll} 
                className="w-full mt-6"
                disabled={optimizationScore === 100 || optimizeMutation.isPending}
              >
                {optimizeMutation.isPending ? (
                  <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="ml-2 h-4 w-4" />
                )}
                تحسين الكل بنقرة واحدة
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => setLocation("/vendor/dashboard")}
              >
                العودة
              </Button>
              
              <Button 
                onClick={() => setLocation(`/store/${storeId}`)}
                variant="ghost"
                className="text-primary"
              >
                معاينة المتجر
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* المحتوى الرئيسي - تفاصيل التحسين */}
        <div className="w-full md:w-2/3">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="images">الصور</TabsTrigger>
              <TabsTrigger value="content">المحتوى</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>نظرة عامة على التحسينات</CardTitle>
                  <CardDescription>
                    فيما يلي المجالات الرئيسية التي يمكن تحسينها في متجرك
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <OptimizationCheck 
                    title="شعار المتجر" 
                    isOptimal={store.logo && !store.logo.includes("placehold.co")}
                    description="شعار جذاب ومميز يساعد العملاء على تذكر متجرك بسهولة" 
                    onOptimize={() => optimizeElement("logo")}
                  />
                  
                  <OptimizationCheck 
                    title="صورة الغلاف" 
                    isOptimal={store.coverImage && !store.coverImage.includes("placehold.co")}
                    description="صورة غلاف عالية الجودة تعرض هوية متجرك وتجذب المزيد من العملاء" 
                    onOptimize={() => optimizeElement("cover")}
                  />
                  
                  <OptimizationCheck 
                    title="وصف المتجر" 
                    isOptimal={store.description && store.description.length >= 50}
                    description="وصف تفصيلي يشرح طبيعة متجرك والمنتجات التي تقدمها" 
                    onOptimize={() => optimizeElement("description")}
                  />
                  
                  <OptimizationCheck 
                    title="تصنيف المتجر" 
                    isOptimal={store.category && store.category.length > 3}
                    description="تصنيف واضح يساعد العملاء في العثور على متجرك بسهولة" 
                    onOptimize={() => optimizeElement("category")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>تحسين الصور</CardTitle>
                  <CardDescription>
                    تحسين الشعار وصورة الغلاف لمتجرك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">شعار المتجر</h3>
                      <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center mb-4">
                        <img 
                          src={store.logo || "https://placehold.co/100x100?text=Logo"} 
                          alt="شعار المتجر" 
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                      <Button 
                        onClick={() => optimizeElement("logo")} 
                        disabled={store.logo && !store.logo.includes("placehold.co")}
                        variant="outline"
                        className="w-full"
                      >
                        <Wand2 className="ml-2 h-4 w-4" />
                        تحسين الشعار
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">صورة الغلاف</h3>
                      <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center mb-4">
                        <img 
                          src={store.coverImage || "https://placehold.co/800x300?text=Cover"} 
                          alt="صورة غلاف المتجر" 
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                      <Button 
                        onClick={() => optimizeElement("cover")} 
                        disabled={store.coverImage && !store.coverImage.includes("placehold.co")}
                        variant="outline"
                        className="w-full"
                      >
                        <Wand2 className="ml-2 h-4 w-4" />
                        تحسين صورة الغلاف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>تحسين المحتوى</CardTitle>
                  <CardDescription>
                    تحسين المحتوى النصي لمتجرك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">اسم المتجر</h3>
                      <div className="bg-gray-100 p-4 rounded-md mb-4">
                        <p className="text-base">{store.name}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">وصف المتجر</h3>
                      <div className="bg-gray-100 p-4 rounded-md mb-4">
                        <p className="text-base">{store.description || "لا يوجد وصف"}</p>
                      </div>
                      <Button 
                        onClick={() => optimizeElement("description")} 
                        disabled={store.description && store.description.length >= 50}
                        variant="outline"
                        className="w-full"
                      >
                        <Wand2 className="ml-2 h-4 w-4" />
                        تحسين الوصف
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">تصنيف المتجر</h3>
                      <div className="bg-gray-100 p-4 rounded-md mb-4">
                        <p className="text-base">{store.category || "غير محدد"}</p>
                      </div>
                      <Button 
                        onClick={() => optimizeElement("category")} 
                        disabled={store.category && store.category.length > 3}
                        variant="outline"
                        className="w-full"
                      >
                        <Wand2 className="ml-2 h-4 w-4" />
                        تحسين التصنيف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات المتجر</CardTitle>
                  <CardDescription>
                    إعدادات وخصائص متجرك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
                      <div>
                        <h3 className="font-medium">حالة الاشتراك</h3>
                        <p className="text-sm text-muted-foreground">
                          {store.isSubscribed ? "مفعل" : "غير مفعل"}
                        </p>
                      </div>
                      {store.isSubscribed ? (
                        <Button variant="ghost" className="text-green-500">
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                          مفعل
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setLocation(`/api/stores/${storeId}/subscribe`)}
                          variant="outline"
                        >
                          تفعيل الاشتراك
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
                      <div>
                        <h3 className="font-medium">عدد المنتجات</h3>
                        <p className="text-sm text-muted-foreground">
                          {store.productCount || 0} منتج
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => setLocation("/vendor/products/new")}
                        className="text-primary"
                      >
                        إضافة منتج
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
                      <div>
                        <h3 className="font-medium">تقييم المتجر</h3>
                        <p className="text-sm text-muted-foreground">
                          {store.rating ? store.rating.toFixed(1) : 0} / 5
                        </p>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span 
                            key={index} 
                            className={`text-lg ${index < Math.round(store.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}