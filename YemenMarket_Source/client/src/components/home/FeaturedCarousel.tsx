import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface Advertisement {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideInterval = 4000; // 4 seconds
  
  const { data: advertisements = [], isLoading } = useQuery<Advertisement[]>({
    queryKey: ['/api/advertisements'],
  });

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // تلقائي تحرك الإعلانات
  useEffect(() => {
    resetTimeout();
    if (advertisements.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % advertisements.length);
      }, slideInterval);
    }
    return () => resetTimeout();
  }, [currentSlide, advertisements.length]);

  if (isLoading) {
    return (
      <section className="mb-8 relative">
        <div className="bg-gray-200 animate-pulse h-40 sm:h-48 md:h-64 lg:h-72 rounded-lg w-full"></div>
      </section>
    );
  }

  if (advertisements.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 relative">
      <div className="overflow-hidden rounded-lg relative">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-40 sm:h-48 md:h-64 lg:h-72"
          style={{ 
            width: `${advertisements.length * 100}%`, 
            transform: `translateX(${(advertisements.length - 1 - currentSlide) * (100 / advertisements.length)}%)` 
          }}
        >
          {advertisements.map((ad) => (
            <div 
              key={ad.id}
              className="relative w-full h-full"
            >
              <img 
                src={ad.image} 
                alt={ad.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex items-end p-3 sm:p-4 md:p-6">
                <div className="text-white">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 md:mb-2">{ad.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90 mb-2 md:mb-3 line-clamp-2">{ad.description}</p>
                  <Link href={ad.link || '#'}>
                    <button className="bg-primary hover:bg-primary/90 text-textDark px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                      تسوق الآن
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      

    </section>
  );
};

export default FeaturedCarousel;
