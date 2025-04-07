import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  layoutMode?: "grid" | "list";
}

const ProductCard = ({ product, layoutMode = "grid" }: ProductCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();
  
  // إضافة إلى السلة
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cart/items", {
        productId: product.id,
        quantity: 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة المنتج إلى السلة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "فشلت الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج إلى السلة",
        variant: "destructive",
      });
    }
  });
  
  // إضافة إلى المفضلة
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/wishlist", {
        productId: product.id
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة المنتج إلى المفضلة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "فشلت الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج إلى المفضلة",
        variant: "destructive",
      });
    }
  });

  // بطاقة المنتج في وضع الشبكة Grid
  if (layoutMode === "grid") {
    return (
      <div 
        className="group bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* صورة المنتج وازرار العملية */}
        <div className="relative">
          <Link href={`/product/${product.id}`}>
            <a className="block h-48 overflow-hidden relative">
              <div 
                className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              
              {/* علامة الخصم */}
              {product.oldPrice && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% خصم
                </div>
              )}
            </a>
          </Link>
          
          {/* أزرار التفاعل */}
          <div className={`absolute top-2 left-2 space-y-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => addToWishlistMutation.mutate()}
              className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:text-primary transition"
              aria-label="إضافة للمفضلة"
            >
              <Heart size={16} />
            </button>
            <button 
              onClick={() => addToCartMutation.mutate()}
              className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:text-primary transition"
              aria-label="إضافة للسلة"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
        
        {/* تفاصيل المنتج */}
        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <a className="block">
              <h3 className="font-medium text-textDark hover:text-primary transition line-clamp-1">
                {product.name}
              </h3>
              <p className="text-textMedium text-sm mt-1 line-clamp-2 h-10">
                {product.description}
              </p>
            </a>
          </Link>
          
          {/* الأسعار */}
          <div className="mt-2 flex justify-between items-center">
            <div>
              <span className="font-medium text-primary">{product.price} $</span>
              {product.oldPrice && (
                <span className="text-textLight text-sm line-through mr-2">{product.oldPrice} $</span>
              )}
            </div>
            
            {/* التقييم */}
            {product.rating !== undefined && (
              <div className="flex items-center text-sm">
                <span className="text-yellow-500">★</span>
                <span className="mr-1">{product.rating}</span>
              </div>
            )}
          </div>
          
          {/* زر إضافة للسلة */}
          <Button 
            onClick={() => addToCartMutation.mutate()}
            className="w-full mt-3 bg-primary hover:bg-primary/90 text-textDark"
            size="sm"
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري...
              </span>
            ) : (
              <>
                <ShoppingCart size={16} className="ml-1" />
                أضف للسلة
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  // بطاقة المنتج في وضع القائمة List
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 flex">
      {/* صورة المنتج */}
      <div className="relative w-1/3 max-w-[200px]">
        <Link href={`/product/${product.id}`}>
            <div 
              className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${product.image})`, minHeight: "180px" }}
            />
            
            {/* علامة الخصم */}
            {product.oldPrice && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% خصم
              </div>
            )}
        </Link>
      </div>
      
      {/* تفاصيل المنتج */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-textDark hover:text-primary transition">
                {product.name}
              </h3>
              <p className="text-textMedium text-sm mt-1">
                {product.description}
              </p>
          </Link>
          
          {/* الأسعار */}
          <div className="mt-3 flex items-center">
            <span className="font-medium text-primary">{product.price} $</span>
            {product.oldPrice && (
              <span className="text-textLight text-sm line-through mr-2">{product.oldPrice} $</span>
            )}
            
            {/* التقييم */}
            {product.rating !== undefined && (
              <div className="flex items-center text-sm mr-4">
                <span className="text-yellow-500">★</span>
                <span className="mr-1">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* أزرار العمليات */}
        <div className="mt-4 flex space-x-2 space-x-reverse">
          <Button 
            onClick={() => addToCartMutation.mutate()}
            className="bg-primary hover:bg-primary/90 text-textDark"
            size="sm"
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? "جاري..." : "أضف للسلة"}
          </Button>
          <Button 
            onClick={() => addToWishlistMutation.mutate()}
            variant="outline" 
            size="sm"
            disabled={addToWishlistMutation.isPending}
          >
            <Heart size={16} className="ml-1" />
            للمفضلة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;