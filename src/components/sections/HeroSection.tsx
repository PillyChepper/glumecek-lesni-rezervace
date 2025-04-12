
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section 
      id="domov" 
      className="w-full bg-gray-800 text-white py-20" 
      style={{ 
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <h1 className="text-4xl md:text-6xl font-display font-semibold mb-4">
        Glumeček
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto px-4 text-center">
        Útočiště v srdci brdských lesů pro váš dokonalý odpočinek
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/rezervace">
          <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-white">
            Rezervovat pobyt
          </Button>
        </Link>
        <a href="#o-nas">
          <Button variant="outline" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white">
            Objevit více
          </Button>
        </a>
      </div>
      
      <a 
        href="#o-nas" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        aria-label="Posunout dolů"
        style={{
          transform: 'translateX(-50%)'
        }}
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
