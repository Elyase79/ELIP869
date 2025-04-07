import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProductCard from '../product/ProductCard';

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

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">منتجات مميزة</h2>
          <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">منتجات مميزة</h2>
        <Link href="/products" className="text-primary text-sm font-medium">
          عرض الكل
        </Link>
      </div>
      
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
    </section>
  );
};

export default FeaturedProducts;
