
import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Section from '@/components/Section';

// Import the image from our assets folder
import { glumecekImage, cabinImage } from '@/assets/images';

const AboutSection = () => {
  const [imageError, setImageError] = useState(false);
  // Fallback image from Unsplash (forest cabin)
  const fallbackImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

  return (
    <Section id="o-nas">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="section-title">Vítejte v Glumečku</h2>
          <p className="mb-4 text-forest-700">
            Naše malá lesní oáza v srdci Brd nabízí jedinečný zážitek pro všechny milovníky přírody a klidu.
          </p>
          <p className="mb-6 text-forest-700">
            Ručně postavený domek Glumeček vám poskytne vše, co potřebujete pro dokonalý odpočinek - 
            komfort, soukromí a přímé spojení s nádhernou okolní přírodou. Bez rušivých zvuků města, 
            jen vy a les kolem vás.
          </p>
          <p className="text-forest-700">
            Domek je navržen tak, aby respektoval okolní přírodu a zároveň poskytoval všechny moderní vymoženosti. 
            Postavený z přírodních materiálů se dokonale začleňuje do lesního prostředí, 
            zatímco interiér nabízí útulné a komfortní zázemí.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <AspectRatio ratio={3/2} className="bg-muted">
            <img 
              src={imageError ? fallbackImage : cabinImage} 
              alt="Domek Glumeček v lese" 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </AspectRatio>
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
