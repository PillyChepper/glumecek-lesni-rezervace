
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroBackgroundImage } from '@/assets/images';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section 
      id="domov" 
      className="w-full bg-gray-800 text-white relative flex flex-col justify-center items-center"
      style={{ 
        height: '100vh',
        backgroundImage: `url(${heroBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className={`relative z-10 text-center px-4 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl font-display font-semibold mb-4">
          Glumeček
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-center">
          Útočiště v srdci brdských lesů pro váš dokonalý odpočinek
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/rezervace">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white">
              Rezervovat pobyt
            </Button>
          </Link>
          <a href="#o-nas">
            <Button variant="outline" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white">
              Objevit více
            </Button>
          </a>
        </div>
      </div>
      
      <a 
        href="#o-nas" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10 animate-bounce"
        aria-label="Posunout dolů"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
