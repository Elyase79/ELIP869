import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, TrendingUp, DollarSign, AlertCircle, ShoppingCart, Package2, Users, Settings, Wand2, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function VendorDashboard() {
  const [location, setLocation] = useLocation();
  
  // بيانات المتجر للبائع الحالي (نحن هنا نفترض أن البائع لديه متجر واحد)
  const { data: stores } = useQuery<any[]>({
    queryKey: ["/api/stores"],
    select: (data) => data.slice(0, 1), // نستخدم أول متجر للتبسيط
  });

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم البائع</h1>
          <p className="text-muted-foreground">إدارة متجرك ومنتجاتك وطلباتك بسهولة</p>
        </div>
        <div className="flex gap-2">
          {stores && stores[0] && (
            <Button 
              onClick={() => setLocation(`/vendor/store/${stores[0].id}/optimize`)}
              variant="outline"
              className="text-primary"
            >
              <Wand2 className="ml-2 h-4 w-4" />
              تحسين المتجر
            </Button>
          )}
          <Button onClick={() => setLocation("/vendor/products/new")}>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المبيعات اليوم</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">﷼‎1,250</div>
            <p className="text-xs text-muted-foreground">+18.2% من الأمس</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الطلبات الجديدة</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 طلبات في آخر ساعة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المنتجات منخفضة المخزون</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">مطلوب تجديد المخزون</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الزوار اليوم</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">+5.2% من الأمس</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="orders">الطلبات الحديثة</TabsTrigger>
          <TabsTrigger value="products">المنتجات الأكثر مبيعاً</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء المبيعات</CardTitle>
              <CardDescription>تحليل مبيعاتك خلال الأسبوع الماضي</CardDescription>
            </CardHeader>
            <CardContent>
              {/* أستبدل هذا بمخطط إحصائي */}
              <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الطلبات الأخيرة</CardTitle>
                <CardDescription>آخر 5 طلبات تم استلامها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <div key={order} className="flex items-center justify-between pb-2 border-b">
                      <div>
                        <div className="font-medium">طلب #{1000 + order}</div>
                        <div className="text-sm text-muted-foreground">منذ {order} ساعة</div>
                      </div>
                      <div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">تم الدفع</span>
                      </div>
                      <div className="font-medium">﷼‎{120 + (order * 25)}</div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 w-full">عرض جميع الطلبات</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>منتجات قليلة المخزون</CardTitle>
                <CardDescription>منتجات تحتاج إلى تجديد المخزون</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center pb-2 border-b">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center ml-3">
                        <Package2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">منتج #{item}</div>
                        <div className="text-sm text-muted-foreground">الكمية المتبقية: {item}</div>
                      </div>
                      <Button size="sm">تجديد</Button>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 w-full">إدارة المخزون</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الحديثة</CardTitle>
              <CardDescription>عرض وإدارة الطلبات الواردة إلى متجرك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-wrap md:flex-nowrap items-center justify-between pb-4 border-b">
                    <div className="w-full md:w-auto mb-2 md:mb-0">
                      <div className="font-medium">طلب #{1000 + i}</div>
                      <div className="text-sm text-muted-foreground">العميل: محمد أحمد</div>
                    </div>
                    <div className="w-full md:w-auto mb-2 md:mb-0">
                      <div className="text-sm">{new Date(Date.now() - (i * 3600000)).toLocaleDateString('ar-EG')}</div>
                      <div className="text-sm text-muted-foreground">{new Date(Date.now() - (i * 3600000)).toLocaleTimeString('ar-EG')}</div>
                    </div>
                    <div className="w-full md:w-auto mb-2 md:mb-0">
                      <div className="text-sm">{2 + (i % 3)} منتجات</div>
                      <div className="font-medium">﷼‎{150 + (i * 25)}</div>
                    </div>
                    <div className="w-full md:w-auto mb-2 md:mb-0">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        i % 4 === 0 ? "bg-amber-100 text-amber-800" : 
                        i % 4 === 1 ? "bg-blue-100 text-blue-800" : 
                        i % 4 === 2 ? "bg-green-100 text-green-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {i % 4 === 0 ? "في انتظار الدفع" : 
                        i % 4 === 1 ? "قيد التجهيز" : 
                        i % 4 === 2 ? "تم الشحن" : 
                        "تم التسليم"}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">عرض التفاصيل</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
              <CardDescription>تعرف على أداء منتجاتك وإحصائيات المبيعات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center pb-4 border-b">
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center ml-3">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">منتج #{i+1}</div>
                      <div className="text-sm text-muted-foreground">الفئة: {["إلكترونيات", "ملابس", "منزل وحديقة"][i % 3]}</div>
                    </div>
                    <div className="mx-4 text-right">
                      <div className="font-medium">﷼‎{99 + (i * 30)}</div>
                      <div className="text-sm text-muted-foreground">المبيعات: {50 - (i * 5)}</div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" className="ml-2">تعديل</Button>
                      <Button size="sm">عرض</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المتجر</CardTitle>
              <CardDescription>تحليلات متجرك خلال الشهر الماضي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">﷼‎18,925</div>
                    <p className="text-xs text-muted-foreground">+12.5% من الشهر الماضي</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">+0.4% من الشهر الماضي</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">﷼‎156</div>
                    <p className="text-xs text-muted-foreground">+5.2% من الشهر الماضي</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}