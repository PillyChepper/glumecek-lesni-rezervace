
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import AccommodationSection from '@/components/sections/AccommodationSection';
import LocationSection from '@/components/sections/LocationSection';
import PricingSection from '@/components/sections/PricingSection';
import CalendarSection from '@/components/sections/CalendarSection';

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AccommodationSection />
      <LocationSection />
      <PricingSection />
      <CalendarSection />
      <Footer />
    </div>
  );
};

export default Index;
