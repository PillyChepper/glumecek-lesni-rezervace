
import { useState } from 'react';
import Section from '@/components/Section';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Import the image from our assets folder
import { glumecekImage } from '@/assets/images';

const LocationSection = () => {
  const [imageError, setImageError] = useState(false);
  // Fallback image from Unsplash (forest landscape)
  const fallbackImage = "https://images.unsplash.com/photo-1472396961693-142e6e269027";

  return (
    <Section id="lokalita" className="px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
          <AspectRatio ratio={3/2} className="bg-muted">
            <img 
              src={imageError ? fallbackImage : glumecekImage} 
              alt="Krajina Brdských lesů" 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </AspectRatio>
        </div>
        <div className="order-1 md:order-2 px-4 md:px-0">
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
  );
};

export default LocationSection;
