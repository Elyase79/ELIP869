// Generate star rating display
export function generateRatingStars(rating: number): JSX.Element[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="fas fa-star text-primary text-xs"></i>);
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt text-primary text-xs"></i>);
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star text-primary text-xs"></i>);
  }
  
  return stars;
}