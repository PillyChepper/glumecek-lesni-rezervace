
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Simple animation for when the section comes into view
  useEffect(() => {
    if (heroImageRef.current) {
      heroImageRef.current.classList.add('reveal');
    }
  }, []);

  return (
    <section id="domov" className="hero-section relative flex items-center justify-center overflow-hidden bg-forest-800 min-h-[600px]">
      {/* Solid background div */}
      <div 
        ref={heroImageRef} 
        className="absolute inset-0 image-reveal"
        style={{
          backgroundColor: '#1F2937', // Darker background for better contrast
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-white mb-4 drop-shadow-lg">
          Glumeček
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
          Útočiště v srdci brdských lesů pro váš dokonalý odpočinek
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/rezervace">
            <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-white">
              Rezervovat pobyt
            </Button>
          </Link>
          <a href="#o-nas">
            <Button variant="outline" size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white">
              Objevit více
            </Button>
          </a>
        </div>
      </div>
      
      <a 
        href="#o-nas" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        aria-label="Posunout dolů"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
