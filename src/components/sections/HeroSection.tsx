
import { ChevronDown } from 'lucide-react';
import { heroBackgroundImage } from '@/assets/images';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    setLoaded(true);
    
    // Animate title first
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 300);
    
    // Animate subtitle after title with a split second delay
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
    };
  }, []);

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  };

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
      
      <div className={`relative z-10 text-center px-4 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className={`text-4xl md:text-6xl font-display font-semibold mb-4 transition-all duration-700 transform ${showTitle ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          Glumeček
        </h1>
        <p className={`text-xl md:text-2xl max-w-2xl mx-auto text-center transition-all duration-700 transform ${showSubtitle ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          Útočiště v srdci brdských lesů pro váš dokonalý odpočinek
        </p>
      </div>
      
      <a 
        href="#o-nas" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10 animate-bounce"
        aria-label="Posunout dolů"
        onClick={(e) => handleSmoothScroll(e, "o-nas")}
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
