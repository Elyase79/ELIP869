import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import { generateRatingStars } from '@/lib/starRating';

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface ReviewCardProps {
  id: number;
  userId: number;
  content: string;
  rating: number;
  createdAt: string;
  likes: number;
  comments: number;
}

const ReviewCard = ({ id, userId, content, rating, createdAt, likes: initialLikes, comments }: ReviewCardProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });
  
  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-16 bg-gray-200 rounded mb-3"></div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="h-6 w-14 bg-gray-200 rounded"></div>
            <div className="h-6 w-14 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-3 mb-3">
        <img 
          src={user.avatar || `https://placehold.co/80x80?text=${user.name.charAt(0)}`} 
          alt={user.name} 
          className="w-10 h-10 rounded-full object-cover" 
        />
        <div>
          <h3 className="font-medium text-textDark">{user.name}</h3>
          <div className="flex items-center">
            <div className="flex">
              {generateRatingStars(rating)}
            </div>
            <span className="text-xs text-textLight mr-2">{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-textMedium mb-3">{content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            className={`${isLiked ? 'text-primary' : 'text-textLight hover:text-primary'} transition text-sm flex items-center gap-1`}
            onClick={handleLike}
          >
            <i className={`${isLiked ? 'fas' : 'far'} fa-thumbs-up`}></i>
            <span>{likes}</span>
          </button>
          <button className="text-textLight hover:text-primary transition text-sm flex items-center gap-1">
            <i className="far fa-comment"></i>
            <span>{comments}</span>
          </button>
        </div>
        <button className="text-textLight hover:text-red-500 transition text-sm">
          <i className="far fa-flag"></i>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
