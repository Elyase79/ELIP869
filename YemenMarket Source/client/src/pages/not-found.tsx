import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center mb-6">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">404 - الصفحة غير موجودة</h1>
            </div>

            <p className="mt-4 mb-6 text-textMedium">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم حذفها.
            </p>
            
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 w-full">
                العودة إلى الصفحة الرئيسية
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
}
