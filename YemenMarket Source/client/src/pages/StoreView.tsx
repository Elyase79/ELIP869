import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ProductCard from '@/components/product/ProductCard';

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

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  salesCount: number;
  isNew: boolean;
  hasDiscount: boolean;
  isBestseller: boolean;
}

const StoreView = () => {
  const { id } = useParams();
  const storeId = parseInt(id || '0');
  
  const { data: store, isLoading: isLoadingStore } = useQuery<Store>({
    queryKey: [`/api/stores/${storeId}`],
  });
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: [`/api/stores/${storeId}/products`],
    enabled: !!storeId,
  });
  
  if (isLoadingStore) {
    return (
      <div className="flex flex-col min-h-screen font-tajawal">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 animate-pulse rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse"></div>
            ))}
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="flex flex-col min-h-screen font-tajawal">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-bold mb-2">المتجر غير موجود</h2>
            <p className="text-textMedium">عذراً، المتجر الذي تبحث عنه غير متوفر أو تم حذفه.</p>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="h-48 relative">
            <img src={store.coverImage} alt={store.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center">
              <img src={store.logo} alt={`شعار ${store.name}`} className="w-16 h-16 rounded-full border-4 border-white object-cover" />
              <div className="mr-4 text-white">
                <h1 className="text-2xl font-bold">{store.name}</h1>
                <p className="text-sm opacity-90">{store.description}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6 space-x-reverse mb-2 md:mb-0">
              <div className="flex items-center">
                <span className="font-medium">{store.rating.toFixed(1)}</span>
                <i className="fas fa-star text-primary mr-1"></i>
              </div>
              <div>
                <span className="text-textMedium">{store.productCount}+ منتج</span>
              </div>
              <div>
                <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm">{store.category}</span>
              </div>
            </div>
            <div>
              <button className="bg-primary text-textDark px-4 py-2 rounded-lg text-sm font-medium mr-2">
                متابعة
              </button>
              <button className="bg-gray-100 text-textDark px-4 py-2 rounded-lg text-sm font-medium">
                مشاركة
              </button>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <h2 className="text-lg font-bold mb-4">منتجات المتجر</h2>
        
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                oldPrice={product.oldPrice}
                rating={product.rating}
                salesCount={product.salesCount}
                isNew={product.isNew}
                hasDiscount={product.hasDiscount}
                isBestseller={product.isBestseller}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-textMedium">لا توجد منتجات في هذا المتجر بعد.</p>
          </div>
        )}
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default StoreView;
