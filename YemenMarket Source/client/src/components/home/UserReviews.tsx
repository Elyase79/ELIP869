import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ReviewCard from '../review/ReviewCard';

interface Review {
  id: number;
  userId: number;
  content: string;
  rating: number;
  createdAt: string;
  likes: number;
  comments: number;
}

const UserReviews = () => {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/featured'],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">آراء المستخدمين</h2>
          <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-48 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">آراء المستخدمين</h2>
        <Link href="/reviews" className="text-primary text-sm font-medium">
          عرض الكل
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map(review => (
          <ReviewCard 
            key={review.id}
            id={review.id}
            userId={review.userId}
            content={review.content}
            rating={review.rating}
            createdAt={review.createdAt}
            likes={review.likes}
            comments={review.comments}
          />
        ))}
      </div>
    </section>
  );
};

export default UserReviews;
