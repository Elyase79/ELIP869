import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface Category {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
}

const CategoriesOverview = () => {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">تصفح حسب الفئات</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-24 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">تصفح حسب الفئات</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map(category => (
          <Link key={category.id} href={`/category/${category.id}`} className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition flex flex-col items-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <i className={`fas fa-${category.icon} text-primary text-xl`}></i>
            </div>
            <span className="text-sm font-medium text-textDark">{category.name}</span>
          </Link>
        ))}
        
        <Link href="/categories" className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition flex flex-col items-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <i className="fas fa-ellipsis-h text-primary text-xl"></i>
          </div>
          <span className="text-sm font-medium text-textDark">المزيد</span>
        </Link>
      </div>
      
      {/* مربع وصف مميزات الموقع */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6 border-r-4 border-primary">
        <h3 className="text-xl font-bold mb-4 text-center text-textDark">مميزات سوق اليمن</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <i className="fas fa-check text-primary"></i>
            </div>
            <div>
              <h4 className="font-semibold text-textDark">منصة متعددة البائعين</h4>
              <p className="text-sm text-textMedium">نوفر لك متاجر متنوعة في مكان واحد لتجربة تسوق متكاملة</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <i className="fas fa-lock text-primary"></i>
            </div>
            <div>
              <h4 className="font-semibold text-textDark">خيارات دفع آمنة</h4>
              <p className="text-sm text-textMedium">طرق دفع متعددة وآمنة لضمان سلامة معاملاتك المالية</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <i className="fas fa-truck text-primary"></i>
            </div>
            <div>
              <h4 className="font-semibold text-textDark">شحن سريع</h4>
              <p className="text-sm text-textMedium">توصيل سريع لمنتجاتك إلى باب منزلك في جميع محافظات اليمن</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <i className="fas fa-tags text-primary"></i>
            </div>
            <div>
              <h4 className="font-semibold text-textDark">عروض وخصومات</h4>
              <p className="text-sm text-textMedium">استمتع بأفضل العروض والخصومات الحصرية على المنتجات المتنوعة</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <i className="fas fa-star text-primary"></i>
            </div>
            <div>
              <h4 className="font-semibold text-textDark">تقييمات المستخدمين</h4>
              <p className="text-sm text-textMedium">اطلع على تقييمات حقيقية من مستخدمين آخرين قبل الشراء</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <i className="fas fa-headset text-primary"></i>
            </div>
            <div>
              <h4 className="font-semibold text-textDark">دعم فني على مدار الساعة</h4>
              <p className="text-sm text-textMedium">فريق دعم فني جاهز لمساعدتك في أي وقت لضمان تجربة تسوق مثالية</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesOverview;
