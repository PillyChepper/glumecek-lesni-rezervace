
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import the image directly to ensure it works in production
import heroImage from '/lovable-uploads/fecc82ad-de0e-4bc9-962d-ba7f2f6766ac.png';

const HeroSection = () => {
  const heroImageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate hero image in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (heroImageRef.current) {
      observer.observe(heroImageRef.current);
    }
    
    return () => {
      if (heroImageRef.current) {
        observer.unobserve(heroImageRef.current);
      }
    };
  }, []);

  return (
    <section id="domov" className="hero-section relative flex items-center justify-center overflow-hidden">
      <div 
        ref={heroImageRef} 
        className="absolute inset-0 image-reveal"
      >
        <img 
          src={heroImage} 
          alt="Glumeček - domek v lese" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 text-center px-4 animate-fade-in">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce"
        aria-label="Posunout dolů"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
