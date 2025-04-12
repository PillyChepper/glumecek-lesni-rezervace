import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Droplets, Utensils, Wifi, PawPrint, Thermometer, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Section from '@/components/Section';
import Feature from '@/components/Feature';
import Footer from '@/components/Footer';
import ReservationCalendar from '@/components/Calendar';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Import the image directly to ensure it works in production
// Using a direct import with the full path to ensure Vite processes it correctly
import heroImage from '/lovable-uploads/fecc82ad-de0e-4bc9-962d-ba7f2f6766ac.png';

const Index = () => {
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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="domov" className="hero-section relative flex items-center justify-center overflow-hidden">
        <div 
          ref={heroImageRef} 
          className="absolute inset-0 image-reveal"
        >
          {/* Use imported image variable for src */}
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
      
      {/* O nás */}
      <Section id="o-nas">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title">Vítejte v Glumečku</h2>
            <p className="mb-4 text-forest-700">
              Naše malá lesní oáza v srdci Brd nabízí jedinečný zážitek pro všechny milovníky přírody a klidu.
            </p>
            <p className="mb-6">
              Ručně postavený domek Glumeček vám poskytne vše, co potřebujete pro dokonalý odpočinek - 
              komfort, soukromí a přímé spojení s nádhernou okolní přírodou. Bez rušivých zvuků města, 
              jen vy a les kolem vás.
            </p>
            <p>
              Domek je navržen tak, aby respektoval okolní přírodu a zároveň poskytoval všechny moderní vymoženosti. 
              Postavený z přírodních materiálů se dokonale začleňuje do lesního prostředí, 
              zatímco interiér nabízí útulné a komfortní zázemí.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <AspectRatio ratio={3/2} className="bg-muted">
              {/* Use imported image variable for src */}
              <img 
                src={heroImage} 
                alt="Domek Glumeček v lese" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </Section>
      
      {/* Ubytování */}
      <Section id="ubytovani" bgColor="bg-forest-50">
        <h2 className="section-title text-center">Ubytování</h2>
        <p className="text-center max-w-3xl mx-auto mb-12">
          Náš domek je kompletně vybaven vším, co potřebujete pro pohodlný pobyt v přírodě. Spojení moderního komfortu s rustikálním prostředím vám zaručí nezapomenutelný zážitek.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature 
            icon={<Utensils size={32} />}
            title="Plně vybavená kuchyň"
            description="Vařič, lednice, základní kuchyňské vybavení a vše potřebné pro přípravu jídla."
          />
          <Feature 
            icon={<Droplets size={32} />}
            title="Koupelna se sprchou"
            description="Vlastní koupelna s teplou vodou a ekologickými toaletními potřebami."
          />
          <Feature 
            icon={<Wifi size={32} />}
            title="Wi-Fi připojení"
            description="Pro ty, kteří potřebují zůstat ve spojení i uprostřed lesa."
          />
          <Feature 
            icon={<Thermometer size={32} />}
            title="Vytápění"
            description="Kamna na dřevo pro příjemné teplo během chladných večerů."
          />
          <Feature 
            icon={<PawPrint size={32} />}
            title="Pet friendly"
            description="Vaši čtyřnozí přátelé jsou u nás vítáni. Les je ideálním místem pro jejich radost."
          />
          <Feature 
            icon={<MapPin size={32} />}
            title="Soukromí v přírodě"
            description="Žádní sousedé, jen vy a les kolem. Dokonalé místo pro odpočinek a relaxaci."
          />
        </div>
      </Section>
      
      {/* Lokalita */}
      <Section id="lokalita">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
            <AspectRatio ratio={3/2} className="bg-muted">
              {/* Use imported image variable for src */}
              <img 
                src={heroImage} 
                alt="Krajina Brdských lesů" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="section-title">Lokalita</h2>
            <p className="mb-4">
              Glumeček se nachází v malebné oblasti Brd, jednom z nejrozsáhlejších zalesněných území v České republice. 
              Les plný vzrostlých stromů, hub, lesních plodů a divoké zvěře vám poskytne dokonalý únik do přírody.
            </p>
            <p className="mb-4">
              V okolí můžete objevit:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Turistické stezky různých obtížností</li>
              <li>Cyklostezky s nádhernými výhledy</li>
              <li>Historické památky a rozhledny</li>
              <li>Přírodní vodní plochy vhodné ke koupání</li>
              <li>Místní farmy s čerstvými produkty</li>
            </ul>
            <p>
              Domek je dostupný autem s parkováním přímo u objektu. Po příjezdu vám předáme klíče a ukážeme vše potřebné pro váš komfortní pobyt.
            </p>
          </div>
        </div>
      </Section>
      
      {/* Ceník */}
      <Section id="cenik" bgColor="bg-forest-50">
        <h2 className="section-title text-center">Ceník</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-display font-medium mb-2">Základní informace</h3>
              <p className="text-muted-foreground">
                Cena zahrnuje ubytování pro 2 osoby, parkování, povlečení, ručníky a závěrečný úklid.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span>Základní cena za noc</span>
                <span className="font-medium">2 500 Kč</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Minimální délka pobytu</span>
                <span className="font-medium">2 noci</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Příplatek za další osobu</span>
                <span className="font-medium">500 Kč / noc</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Domácí mazlíček</span>
                <span className="font-medium">200 Kč / pobyt</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span>Check-in</span>
                <span className="font-medium">14:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Check-out</span>
                <span className="font-medium">do 11:00</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="mb-4">
              Máte zájem o pobyt v našem lesním domku? Rezervujte si svůj termín!
            </p>
            <Link to="/rezervace">
              <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
                Přejít na rezervace
              </Button>
            </Link>
          </div>
        </div>
      </Section>
      
      {/* Kalendář */}
      <Section id="kalendar">
        <h2 className="section-title text-center mb-12">Ověřte si dostupnost</h2>
        <ReservationCalendar 
          disabledDates={[
            new Date(2025, 3, 15),
            new Date(2025, 3, 16),
            new Date(2025, 3, 17),
            new Date(2025, 3, 18),
          ]}
        />
      </Section>
      
      <Footer />
    </div>
  );
};

export default Index;
