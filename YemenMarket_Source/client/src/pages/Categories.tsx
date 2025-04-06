import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';

interface Category {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
}

const Categories = () => {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">تصفح الفئات</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition flex flex-col items-center justify-center text-center h-full"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <i className={`fas fa-${category.icon} text-primary text-2xl`}></i>
                </div>
                <h2 className="text-lg font-medium">{category.name}</h2>
                <p className="text-sm text-textMedium mt-2">تسوق الآن</p>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">الفئات الشعبية</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <h3 className="font-medium mb-3">الإلكترونيات</h3>
                <ul className="space-y-2 text-sm text-textMedium">
                  <li><Link href="/category/electronics/phones" className="hover:text-primary">الهواتف الذكية</Link></li>
                  <li><Link href="/category/electronics/laptops" className="hover:text-primary">اللابتوب</Link></li>
                  <li><Link href="/category/electronics/tablets" className="hover:text-primary">الأجهزة اللوحية</Link></li>
                  <li><Link href="/category/electronics/accessories" className="hover:text-primary">الإكسسوارات</Link></li>
                  <li><Link href="/category/electronics/cameras" className="hover:text-primary">الكاميرات</Link></li>
                </ul>
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-medium mb-3">الموضة والملابس</h3>
                <ul className="space-y-2 text-sm text-textMedium">
                  <li><Link href="/category/fashion/men" className="hover:text-primary">ملابس رجالية</Link></li>
                  <li><Link href="/category/fashion/women" className="hover:text-primary">ملابس نسائية</Link></li>
                  <li><Link href="/category/fashion/kids" className="hover:text-primary">ملابس أطفال</Link></li>
                  <li><Link href="/category/fashion/shoes" className="hover:text-primary">أحذية</Link></li>
                  <li><Link href="/category/fashion/accessories" className="hover:text-primary">إكسسوارات</Link></li>
                </ul>
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-medium mb-3">المنزل والمطبخ</h3>
                <ul className="space-y-2 text-sm text-textMedium">
                  <li><Link href="/category/home/furniture" className="hover:text-primary">أثاث</Link></li>
                  <li><Link href="/category/home/kitchen" className="hover:text-primary">أدوات مطبخ</Link></li>
                  <li><Link href="/category/home/decor" className="hover:text-primary">ديكور</Link></li>
                  <li><Link href="/category/home/appliances" className="hover:text-primary">أجهزة منزلية</Link></li>
                  <li><Link href="/category/home/bedding" className="hover:text-primary">مفروشات</Link></li>
                </ul>
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-medium mb-3">الصحة والجمال</h3>
                <ul className="space-y-2 text-sm text-textMedium">
                  <li><Link href="/category/beauty/skincare" className="hover:text-primary">العناية بالبشرة</Link></li>
                  <li><Link href="/category/beauty/makeup" className="hover:text-primary">المكياج</Link></li>
                  <li><Link href="/category/beauty/haircare" className="hover:text-primary">العناية بالشعر</Link></li>
                  <li><Link href="/category/beauty/fragrance" className="hover:text-primary">العطور</Link></li>
                  <li><Link href="/category/beauty/personal-care" className="hover:text-primary">العناية الشخصية</Link></li>
                </ul>
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

export default Categories;
