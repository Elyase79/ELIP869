import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, ImagePlus, Save, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// تعريف نموذج بيانات المنتج
const productSchema = z.object({
  name: z.string().min(3, "اسم المنتج يجب أن يحتوي على الأقل 3 أحرف"),
  description: z.string().min(10, "وصف المنتج يجب أن يحتوي على الأقل 10 أحرف"),
  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من صفر"),
  oldPrice: z.coerce.number().positive("السعر القديم يجب أن يكون أكبر من صفر").optional(),
  category: z.string().min(1, "الرجاء اختيار الفئة"),
  quantity: z.coerce.number().int().min(0, "الكمية لا يمكن أن تكون سالبة"),
  sku: z.string().min(1, "الرجاء إدخال رمز المنتج"),
  lowStockThreshold: z.coerce.number().int().min(1, "حد المخزون المنخفض يجب أن يكون أكبر من صفر"),
  isNew: z.boolean().default(false),
  hasDiscount: z.boolean().default(false),
  weight: z.coerce.number().min(0, "الوزن لا يمكن أن يكون سالبا").optional(),
  dimensions: z.string().optional(),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProduct() {
  const [location, setLocation] = useLocation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إعداد نموذج الإدخال
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      oldPrice: undefined,
      category: "",
      quantity: 1,
      sku: "",
      lowStockThreshold: 5,
      isNew: true,
      hasDiscount: false,
      weight: undefined,
      dimensions: "",
      tags: "",
    },
  });

  // معالجة تقديم النموذج
  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("بيانات المنتج:", values);
      // هنا سيتم إرسال البيانات إلى الخادم
      
      // محاكاة الانتظار
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // بعد النجاح، الانتقال إلى صفحة المنتجات
      setLocation("/vendor/products");
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة المنتج:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // معالجة إضافة صورة
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة إضافة صور إضافية
  const handleAdditionalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdditionalImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
          <p className="text-muted-foreground">أضف منتجاً جديداً إلى متجرك</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/vendor/products")}>
            إلغاء
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
            <Save className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
          <TabsTrigger value="images">الصور</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية للمنتج</CardTitle>
                  <CardDescription>أدخل المعلومات الأساسية للمنتج الجديد</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المنتج*</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المنتج" {...field} />
                        </FormControl>
                        <FormDescription>
                          اسم المنتج كما سيظهر للعملاء
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المنتج*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أدخل وصفاً تفصيلياً للمنتج" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          وصف تفصيلي للمنتج يساعد العملاء على فهم مميزاته
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر*</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>
                            سعر المنتج الحالي بالريال
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="oldPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر القديم</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="اختياري"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            السعر قبل الخصم (إذا كان هناك خصم)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الفئة*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر فئة المنتج" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electronics">إلكترونيات</SelectItem>
                            <SelectItem value="fashion">ملابس</SelectItem>
                            <SelectItem value="home">منزل وحديقة</SelectItem>
                            <SelectItem value="beauty">منتجات العناية الشخصية</SelectItem>
                            <SelectItem value="sports">رياضة ولياقة</SelectItem>
                            <SelectItem value="toys">ألعاب</SelectItem>
                            <SelectItem value="baby">منتجات الأطفال</SelectItem>
                            <SelectItem value="books">كتب وقرطاسية</SelectItem>
                            <SelectItem value="food">أغذية ومشروبات</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر الفئة المناسبة لتسهيل العثور على المنتج
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col md:flex-row gap-6">
                    <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 space-x-reverse rounded-lg border p-4 w-full md:w-1/2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">منتج جديد</FormLabel>
                            <FormDescription>
                              تمييز المنتج كمنتج جديد في المتجر
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasDiscount"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 space-x-reverse rounded-lg border p-4 w-full md:w-1/2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">يوجد خصم</FormLabel>
                            <FormDescription>
                              تمييز المنتج كمنتج عليه خصم أو عرض
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>صور المنتج</CardTitle>
                  <CardDescription>أضف صوراً عالية الجودة للمنتج</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="main-image">الصورة الرئيسية*</Label>
                      <div className="mt-2">
                        {imagePreview ? (
                          <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                            <img 
                              src={imagePreview} 
                              alt="معاينة الصورة" 
                              className="w-full h-full object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 left-2"
                              onClick={() => setImagePreview(null)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed rounded-lg w-full h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition"
                            onClick={() => document.getElementById('main-image')?.click()}
                          >
                            <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">انقر لإضافة صورة رئيسية للمنتج</p>
                            <p className="text-xs text-muted-foreground mt-1">الأبعاد الموصى بها: 800×800 بكسل</p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="main-image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label>صور إضافية</Label>
                      <div className="mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {additionalImages.map((image, index) => (
                            <div key={index} className="relative border rounded-lg overflow-hidden h-40">
                              <img 
                                src={image} 
                                alt={`صورة إضافية ${index + 1}`} 
                                className="w-full h-full object-contain"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 left-2"
                                onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== index))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {additionalImages.length < 5 && (
                            <div
                              className="border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition"
                              onClick={() => document.getElementById('additional-image')?.click()}
                            >
                              <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">إضافة صورة</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="additional-image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAdditionalImageUpload}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">يمكنك إضافة حتى 5 صور إضافية للمنتج</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة المخزون</CardTitle>
                  <CardDescription>تتبع وإدارة مخزون المنتج</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رمز المنتج (SKU)*</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: PROD-001" {...field} />
                          </FormControl>
                          <FormDescription>
                            رمز فريد لتعريف المنتج في المخزون
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الكمية المتوفرة*</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            عدد الوحدات المتوفرة في المخزون
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>حد المخزون المنخفض</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          سيتم تنبيهك عندما ينخفض المخزون إلى هذا الحد أو أقل
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>مهم</AlertTitle>
                    <AlertDescription>
                      تأكد من تحديث المخزون باستمرار لتجنب بيع منتجات غير متوفرة.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات إضافية</CardTitle>
                  <CardDescription>معلومات تفصيلية إضافية عن المنتج</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوزن (كجم)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="اختياري"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            وزن المنتج بالكيلوجرام (مفيد للشحن)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الأبعاد</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: 10 × 20 × 5 سم" {...field} />
                          </FormControl>
                          <FormDescription>
                            أبعاد المنتج (الطول × العرض × الارتفاع)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الكلمات المفتاحية والوسوم</FormLabel>
                        <FormControl>
                          <Input placeholder="كلمات مفتاحية مفصولة بفواصل" {...field} />
                        </FormControl>
                        <FormDescription>
                          أضف كلمات مفتاحية تساعد في ظهور المنتج في نتائج البحث
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => setLocation("/vendor/products")}>
          إلغاء
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
          <Save className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}