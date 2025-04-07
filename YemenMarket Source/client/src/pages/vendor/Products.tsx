import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Edit, Trash2, Filter, ArrowUpDown, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// بيانات تجريبية للمنتجات
const PRODUCTS = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `منتج ${i + 1}`,
  sku: `SKU${1000 + i}`,
  category: ["إلكترونيات", "ملابس", "منزل وحديقة", "مستلزمات شخصية"][i % 4],
  price: 99.99 + (i * 10),
  quantity: Math.max(0, 20 - i),
  status: i % 10 === 0 ? "مسودة" : (i % 5 === 0 ? "غير متوفر" : "متوفر"),
  sales: Math.floor(Math.random() * 100),
  createdAt: new Date(Date.now() - (i * 86400000)).toLocaleDateString('ar-EG')
}));

export default function VendorProducts() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // تصفية وترتيب المنتجات
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.includes(searchTerm) || 
                          product.sku.includes(searchTerm);
    
    const matchesCategory = categoryFilter === "all" || 
                           product.category === categoryFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      comparison = a.price - b.price;
    } else if (sortBy === "quantity") {
      comparison = a.quantity - b.quantity;
    } else if (sortBy === "sales") {
      comparison = a.sales - b.sales;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSortOrder = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-muted-foreground">إدارة وتنظيم منتجات متجرك</p>
        </div>
        <Button onClick={() => setLocation("/vendor/products/new")}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>بحث وتصفية</CardTitle>
          <CardDescription>ابحث وصفي المنتجات حسب احتياجاتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">بحث</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="ابحث باسم المنتج أو الرمز"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">الفئة</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                  <SelectItem value="ملابس">ملابس</SelectItem>
                  <SelectItem value="منزل وحديقة">منزل وحديقة</SelectItem>
                  <SelectItem value="مستلزمات شخصية">مستلزمات شخصية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="متوفر">متوفر</SelectItem>
                  <SelectItem value="غير متوفر">غير متوفر</SelectItem>
                  <SelectItem value="مسودة">مسودة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sort">ترتيب حسب</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="الاسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="price">السعر</SelectItem>
                  <SelectItem value="quantity">الكمية</SelectItem>
                  <SelectItem value="sales">المبيعات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>قائمة المنتجات ({filteredProducts.length})</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="ml-2 h-4 w-4" />
                تصدير
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="ml-2 h-4 w-4" />
                    الإجراءات الجماعية
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>تحديث الأسعار</DropdownMenuItem>
                  <DropdownMenuItem>تحديث المخزون</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">حذف المحدد</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableHead>
                  <TableHead className="w-[80px]">المعرف</TableHead>
                  <TableHead className="min-w-[150px]">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSortOrder("name")}>
                      المنتج
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSortOrder("price")}>
                      السعر
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSortOrder("quantity")}>
                      المخزون
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSortOrder("sales")}>
                      المبيعات
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>تاريخ الإضافة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10 mb-3" />
                        <p>لا توجد منتجات لعرضها</p>
                        <p className="text-sm">جرب تعديل معايير البحث أو إضافة منتجات جديدة</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center ml-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>﷼‎{product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={product.quantity <= 5 ? "text-red-500 font-medium" : ""}>
                          {product.quantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          product.status === "متوفر" ? "default" :
                          product.status === "غير متوفر" ? "destructive" :
                          "outline"
                        }>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>{product.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}