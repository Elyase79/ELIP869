import { useState } from 'react';
import { Link } from 'wouter';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  salesCount: number;
  isNew?: boolean;
  hasDiscount?: boolean;
  isBestseller?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  description, 
  image, 
  price, 
  oldPrice, 
  rating, 
  salesCount,
  isNew,
  hasDiscount,
  isBestseller
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic would go here
    console.log('Added to cart:', id);
  };
  
  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer">
        <div className="relative">
          <img src={image} alt={name} className="w-full h-40 object-cover" />
          <button 
            className="absolute top-2 left-2 text-textMedium hover:text-primary transition"
            onClick={toggleFavorite}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
          </button>
          
          {isNew && (
            <div className="absolute top-2 right-2 bg-primary text-xs text-textDark font-medium px-2 py-1 rounded-full">
              جديد
            </div>
          )}
          
          {hasDiscount && !isNew && (
            <div className="absolute top-2 right-2 bg-red-500 text-xs text-white font-medium px-2 py-1 rounded-full">
              خصم {oldPrice && Math.round(((oldPrice - price) / oldPrice) * 100)}%
            </div>
          )}
          
          {isBestseller && !isNew && !hasDiscount && (
            <div className="absolute top-2 right-2 bg-green-500 text-xs text-white font-medium px-2 py-1 rounded-full">
              الأكثر مبيعًا
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="text-xs text-textMedium">{rating.toFixed(1)}</span>
              <i className="fas fa-star text-primary text-xs mr-1"></i>
            </div>
            <span className="text-xs text-textLight">{salesCount}+ مبيعات</span>
          </div>
          <h3 className="font-medium text-textDark mb-1 text-sm">{name}</h3>
          <p className="text-xs text-textLight line-clamp-2 mb-2">{description}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-primary font-bold">{formatPrice(price)}</span>
              {oldPrice && (
                <span className="text-xs text-textLight line-through mr-1">{formatPrice(oldPrice)}</span>
              )}
            </div>
            <button 
              className="bg-primary text-textDark p-2 rounded-full"
              onClick={addToCart}
            >
              <i className="fas fa-shopping-cart text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
