import { Link } from 'wouter';

interface StoreCardProps {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  logo: string;
  rating: number;
  productCount: number;
}

const StoreCard = ({ id, name, description, coverImage, logo, rating, productCount }: StoreCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-24 bg-gray-100 relative">
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          <img src={logo} alt={`شعار ${name}`} className="w-8 h-8 rounded-full object-cover" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-textDark">{name}</h3>
          <div className="flex items-center">
            <span className="text-xs text-textMedium">{rating.toFixed(1)}</span>
            <i className="fas fa-star text-primary text-xs mr-1"></i>
          </div>
        </div>
        <p className="text-xs text-textLight mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-accent text-primary px-2 py-1 rounded-full">
            {productCount}+ منتج
          </span>
          <Link href={`/store/${id}`}>
            <button className="text-primary text-xs font-medium">زيارة المتجر</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
