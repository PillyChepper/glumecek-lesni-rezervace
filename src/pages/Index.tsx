
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import AccommodationSection from '@/components/sections/AccommodationSection';
import LocationSection from '@/components/sections/LocationSection';
import PricingSection from '@/components/sections/PricingSection';
import ReservationCTASection from '@/components/sections/ReservationCTASection';

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <AccommodationSection />
      <LocationSection />
      <PricingSection />
      <ReservationCTASection />
      <Footer />
    </div>
  );
};

export default Index;
