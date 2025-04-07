import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import StoreCard from '../store/StoreCard';

interface Store {
  id: number;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  productCount: number;
}

const FeaturedStores = () => {
  const { data: stores = [], isLoading } = useQuery<Store[]>({
    queryKey: ['/api/stores/featured'],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">المتاجر المميزة</h2>
          <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-48 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">المتاجر المميزة</h2>
        <Link href="/stores" className="text-primary text-sm font-medium">
          عرض الكل
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stores.map(store => (
          <StoreCard 
            key={store.id}
            id={store.id}
            name={store.name}
            description={store.description}
            logo={store.logo}
            coverImage={store.coverImage}
            rating={store.rating}
            productCount={store.productCount}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedStores;
