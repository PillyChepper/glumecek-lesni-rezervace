
import { useState } from 'react';
import Section from '@/components/Section';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import LeafletMap from '@/components/LeafletMap';
import InteractiveMapMarkers from '@/components/map/InteractiveMapMarkers';
import MapLayerControls from '@/components/map/MapLayerControls';
import { MapPin, Camera, TreePine, Castle, Waves, Map } from 'lucide-react';

// Import the image from our organized assets folder
import { surroundingAreaImage } from '@/assets/images';

// Convert the coordinates from DMS format to decimal degrees
// 49°35'12.3"N 13°50'43.4"E
const LATITUDE = 49 + (35/60) + (12.3/3600);  // 49.58675
const LONGITUDE = 13 + (50/60) + (43.4/3600);  // 13.84539

const pointsOfInterest = [
  {
    id: 'voltusska-vyhlidka',
    icon: <Camera className="w-5 h-5" />,
    name: "Voltušská vyhlídka",
    distance: "3.5 km",
    description: "Krásná vyhlídka s panoramatickým výhledem na okolní krajinu Brd",
    latitude: LATITUDE + 0.02,
    longitude: LONGITUDE - 0.01,
    category: 'viewpoint' as const
  },
  {
    id: 'bila-skala',
    icon: <Camera className="w-5 h-5" />,
    name: "Vyhlídka Bílá skála",
    distance: "2 km",
    description: "Skalní vyhlídka s jedinečným výhledem na Brdy a okolní lesy",
    latitude: LATITUDE + 0.015,
    longitude: LONGITUDE + 0.008,
    category: 'viewpoint' as const
  },
  {
    id: 'kotelsky-rybnik',
    icon: <Waves className="w-5 h-5" />,
    name: "Velký Kotelský rybník",
    distance: "4.5 km",
    description: "Vodní nádrž vhodná ke koupání, rybaření a vodním sportům",
    latitude: LATITUDE - 0.025,
    longitude: LONGITUDE + 0.02,
    category: 'water' as const
  },
  {
    id: 'sterbina',
    icon: <Camera className="w-5 h-5" />,
    name: "Štěrbina (753 m)",
    distance: "2.3 km",
    description: "Turistický cíl s krásným výhledem na okolní krajinu",
    latitude: LATITUDE + 0.018,
    longitude: LONGITUDE - 0.005,
    category: 'nature' as const
  },
  {
    id: 'naucna-stezka',
    icon: <Map className="w-5 h-5" />,
    name: "Naučná stezka Tři trubky",
    distance: "4 km",
    description: "Vzdělávací stezka s informacemi o místní flóře a fauně",
    latitude: LATITUDE + 0.01,
    longitude: LONGITUDE + 0.015,
    category: 'trail' as const
  },
  {
    id: 'padrtske-rybniky',
    icon: <TreePine className="w-5 h-5" />,
    name: "Padrťské rybníky",
    distance: "18 km",
    description: "Soustava rybníků ideální pro pozorování ptactva a klidné procházky",
    latitude: LATITUDE - 0.08,
    longitude: LONGITUDE + 0.05,
    category: 'nature' as const
  }
];

const LocationSection = () => {
  const [imageError, setImageError] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  console.log("Image path being used:", surroundingAreaImage);

  const handleMapInit = (mapInstance: L.Map) => {
    setMap(mapInstance);
  };

  return (
    <Section id="lokalita">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1 rounded-xl overflow-hidden shadow-lg">
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
          </ul>
          <p>
            Domek je dostupný autem s parkováním přímo u objektu. Po příjezdu vám předáme klíče a ukážeme vše potřebné pro váš komfortní pobyt.
          </p>
        </div>
      </div>

      {/* Points of Interest Section */}
      <div className="mb-12">
        <h3 className="text-2xl md:text-3xl font-display font-medium text-forest-700 mb-4 text-center">
          Zajímavá místa v okolí
        </h3>
        <p className="text-center text-muted-foreground mb-8">
          Vzdálenosti jsou měřeny od chatky Glumeček - klikněte na mapu pro interaktivní průzkum
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pointsOfInterest.map((poi, index) => (
            <div key={index} className="bg-forest-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="text-forest-600 mt-1 flex-shrink-0">
                  {poi.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-forest-800 mb-2">{poi.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{poi.distance}</span>
                  </div>
                  <p className="text-sm text-gray-600">{poi.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl md:text-2xl font-display font-medium text-forest-700 mb-4 text-center">
          Interaktivní mapa okolí
        </h3>
        <div className="rounded-xl overflow-hidden shadow-lg relative" style={{ height: '500px' }}>
          <LeafletMap
            latitude={LATITUDE}
            longitude={LONGITUDE}
            zoom={13}
            height="500px"
            onMapInit={handleMapInit}
          />
          {map && (
            <>
              <InteractiveMapMarkers
                map={map}
                pois={pointsOfInterest}
                cabinLocation={{ latitude: LATITUDE, longitude: LONGITUDE }}
              />
              <MapLayerControls map={map} />
            </>
          )}
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Souřadnice: 49°35'12.3"N 13°50'43.4"E • Klikněte na značky pro více informací
        </p>
      </div>
    </Section>
  );
};

export default LocationSection;
