import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { formatPrice } from '@/lib/utils';
import { generateRatingStars } from '@/lib/starRating';

interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  salesCount: number;
  isNew: boolean;
  hasDiscount: boolean;
  isBestseller: boolean;
}

interface Store {
  id: number;
  name: string;
  logo: string;
  rating: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const productId = parseInt(id || '0');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });
  
  const { data: store } = useQuery<Store>({
    queryKey: [`/api/stores/${product?.storeId}`],
    enabled: !!product?.storeId,
  });
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  if (isLoadingProduct) {
    return (
      <div className="flex flex-col min-h-screen font-tajawal">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/5 h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="lg:w-3/5">
                <div className="h-8 bg-gray-200 animate-pulse rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-4 w-1/4"></div>
                <div className="h-24 bg-gray-200 animate-pulse rounded mb-4"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded mb-4 w-1/3"></div>
                <div className="h-12 bg-gray-200 animate-pulse rounded mb-4 w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen font-tajawal">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-bold mb-2">المنتج غير موجود</h2>
            <p className="text-textMedium">عذراً، المنتج الذي تبحث عنه غير متوفر أو تم حذفه.</p>
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image */}
            <div className="lg:w-2/5">
              <div className="relative rounded-lg overflow-hidden h-80">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.isNew && (
                  <div className="absolute top-2 right-2 bg-primary text-xs text-textDark font-medium px-2 py-1 rounded-full">
                    جديد
                  </div>
                )}
                {product.hasDiscount && !product.isNew && (
                  <div className="absolute top-2 right-2 bg-red-500 text-xs text-white font-medium px-2 py-1 rounded-full">
                    خصم {product.oldPrice && Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="lg:w-3/5">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {generateRatingStars(product.rating)}
                </div>
                <span className="mx-2 text-textMedium">({product.rating.toFixed(1)})</span>
                <span className="text-textMedium">{product.salesCount}+ مبيعات</span>
              </div>
              
              {store && (
                <div className="flex items-center mb-4">
                  <img src={store.logo} alt={store.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="mr-2 text-textMedium">{store.name}</span>
                </div>
              )}
              
              <p className="text-textMedium mb-6">{product.description}</p>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-textLight line-through mr-2">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>
                
                <span className="text-sm text-textMedium">الفئة: {product.category}</span>
              </div>
              
              {/* Quantity */}
              <div className="flex items-center mb-6">
                <span className="text-textDark mr-2">الكمية:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    className="px-3 py-1 bg-gray-100 text-textDark"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-center">{quantity}</span>
                  <button 
                    className="px-3 py-1 bg-gray-100 text-textDark"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-textDark px-6 py-2 rounded-lg font-medium flex-grow md:flex-grow-0">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  إضافة إلى السلة
                </button>
                <button 
                  className={`border ${isFavorite ? 'border-primary text-primary' : 'border-gray-300 text-textMedium'} px-4 py-2 rounded-lg`}
                  onClick={toggleFavorite}
                >
                  <i className={`${isFavorite ? 'fas' : 'far'} fa-heart mr-2`}></i>
                  المفضلة
                </button>
                <button className="border border-gray-300 text-textMedium px-4 py-2 rounded-lg">
                  <i className="fas fa-share-alt mr-2"></i>
                  مشاركة
                </button>
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

export default ProductDetail;
