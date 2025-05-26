
import { useState } from 'react';
import Section from '@/components/Section';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import LeafletMap from '@/components/LeafletMap';
import { MapPin, Clock, Car, Hiking, Camera, TreePine, Castle, Waves } from 'lucide-react';

// Import the image from our organized assets folder
import { surroundingAreaImage } from '@/assets/images';

// Convert the coordinates from DMS format to decimal degrees
// 49°35'12.3"N 13°50'43.4"E
const LATITUDE = 49 + (35/60) + (12.3/3600);  // 49.58675
const LONGITUDE = 13 + (50/60) + (43.4/3600);  // 13.84539

const pointsOfInterest = [
  {
    icon: <TreePine className="w-5 h-5" />,
    name: "Hřebeny - nejvyšší bod Brd",
    distance: "8 km",
    time: "15 min autem",
    description: "Nejvyšší vrchol Brdských hor s nádherným výhledem do kraje"
  },
  {
    icon: <Castle className="w-5 h-5" />,
    name: "Hrad Týřov",
    distance: "12 km",
    time: "20 min autem",
    description: "Zřícenina gotického hradu s bohatou historií a krásnou procházkou"
  },
  {
    icon: <Waves className="w-5 h-5" />,
    name: "Klíčava - přehrada",
    distance: "15 km",
    time: "25 min autem",
    description: "Vodní nádrž vhodná ke koupání, rybaření a vodním sportům"
  },
  {
    icon: <Camera className="w-5 h-5" />,
    name: "Rozhledna Velika",
    distance: "6 km",
    time: "10 min autem",
    description: "Dřevěná rozhledna s panoramatickým výhledem na Brdy a okolí"
  },
  {
    icon: <Hiking className="w-5 h-5" />,
    name: "Naučná stezka Tři trubky",
    distance: "4 km",
    time: "5 min autem",
    description: "Vzdělávací stezka s informacemi o místní flóře a fauně"
  },
  {
    icon: <TreePine className="w-5 h-5" />,
    name: "Padrťské rybníky",
    distance: "18 km",
    time: "30 min autem",
    description: "Soustava rybníků ideální pro pozorování ptactva a klidné procházky"
  }
];

const LocationSection = () => {
  const [imageError, setImageError] = useState(false);

  console.log("Image path being used:", surroundingAreaImage);

  return (
    <Section id="lokalita" className="px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
          <AspectRatio ratio={3/2} className="bg-muted">
            {!imageError ? (
              <img 
                src={surroundingAreaImage} 
                alt="Krajina Brdských lesů" 
                className="w-full h-full object-cover"
                onError={() => {
                  console.error("Image failed to load:", surroundingAreaImage);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Image failed to load</p>
              </div>
            )}
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

      {/* Points of Interest Section */}
      <div className="mb-12">
        <h3 className="text-2xl md:text-3xl font-display font-medium text-forest-700 mb-8 text-center">
          Zajímavá místa v okolí
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pointsOfInterest.map((poi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="text-forest-600 mt-1 flex-shrink-0">
                  {poi.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-forest-800 mb-2">{poi.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{poi.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      <span>{poi.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{poi.description}</p>
                </div>
              </div>
            </div>
          ))}
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
