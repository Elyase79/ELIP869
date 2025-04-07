import { Link } from 'wouter';

const AdvertBanner = () => {
  return (
    <section className="mb-8">
      <div className="bg-primary/10 rounded-lg overflow-hidden relative">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">اشترك الآن واحصل على متجرك الخاص</h2>
            <p className="text-sm text-textMedium mb-4">فقط 5$ شهريًا للاستمتاع بجميع المميزات والخدمات المتكاملة</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <i className="fas fa-check text-primary"></i>
                <span className="text-xs">10 صفحات لعرض منتجاتك</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <i className="fas fa-check text-primary"></i>
                <span className="text-xs">دعم فني متواصل</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <i className="fas fa-check text-primary"></i>
                <span className="text-xs">إدارة مبيعات متكاملة</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <i className="fas fa-check text-primary"></i>
                <span className="text-xs">تقارير وإحصائيات</span>
              </div>
            </div>
            <Link href="/store/register">
              <button className="bg-primary text-textDark font-medium px-6 py-2 rounded-lg w-fit">سجل الآن</button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://placehold.co/500x300?text=Subscribe+Now" 
              alt="اشترك الآن" 
              className="w-full h-full object-cover md:object-contain" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertBanner;
