import { useState } from 'react';
import Section from '@/components/Section';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import LeafletMap from '@/components/LeafletMap';
import { MapPin } from 'lucide-react';

// Import the image from our organized assets folder
import { surroundingAreaImage } from '@/assets/images';

// Convert the coordinates from DMS format to decimal degrees
// 49°35'12.3"N 13°50'43.4"E
const LATITUDE = 49 + (35/60) + (12.3/3600);  // 49.58675
const LONGITUDE = 13 + (50/60) + (43.4/3600);  // 13.84539

const LocationSection = () => {
  // We'll still keep the fallback mechanism just in case
  const [imageError, setImageError] = useState(false);
  // Fallback image from Unsplash (forest landscape)
  const fallbackImage = "https://images.unsplash.com/photo-1472396961693-142e6e269027";

  return (
    <Section id="lokalita" className="px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
          <AspectRatio ratio={3/2} className="bg-muted">
            <img 
              src={imageError ? fallbackImage : surroundingAreaImage} 
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
      
      <div className="mt-8">
        <h3 className="text-xl md:text-2xl font-display font-medium text-forest-700 mb-4 text-center">Najdete nás zde</h3>
        <div className="rounded-lg overflow-hidden shadow-lg" style={{ height: '400px' }}>
          <LeafletMap
            latitude={LATITUDE}
            longitude={LONGITUDE}
            zoom={15}
            height="400px"
          />
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Souřadnice: 49°35'12.3"N 13°50'43.4"E
        </p>
      </div>
    </Section>
  );
};

export default LocationSection;
