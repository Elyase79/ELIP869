import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import PaymentMethods from "@/components/home/PaymentMethods";
import FeaturedStores from "@/components/home/FeaturedStores";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AdvertBanner from "@/components/home/AdvertBanner";
import UserReviews from "@/components/home/UserReviews";
import CategoriesOverview from "@/components/home/CategoriesOverview";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <FeaturedCarousel />
        <PaymentMethods />
        <FeaturedStores />
        <FeaturedProducts />
        <AdvertBanner />
        <UserReviews />
        <CategoriesOverview />
        

      </main>
      
      <Footer />
      <BottomNavigation />
      
      {/* This script injects a replit badge into the page */}
      <script type="text/javascript" src="https://replit.com/public/js/replit-badge-v3.js"></script>
    </div>
  );
};

export default Home;
