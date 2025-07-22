
import { useEffect } from 'react';
import L from 'leaflet';
import { Camera, Waves, TreePine, Castle, Map as MapIcon, Mountain, Coffee, Utensils } from 'lucide-react';

interface POI {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: 'viewpoint' | 'water' | 'nature' | 'culture' | 'trail' | 'restaurant' | 'accommodation';
  distance: string;
  description: string;
  image?: string;
  website?: string;
}

interface InteractiveMapMarkersProps {
  map: L.Map;
  pois: POI[];
  cabinLocation: { latitude: number; longitude: number };
}

const InteractiveMapMarkers = ({ map, pois, cabinLocation }: InteractiveMapMarkersProps) => {
  
  const getCategoryIcon = (category: POI['category']) => {
    const iconMap = {
      viewpoint: '📷',
      water: '🏊',
      nature: '🌲',
      culture: '🏰',
      trail: '🥾',
      restaurant: '🍽️',
      accommodation: '🏠'
    };
    return iconMap[category] || '📍';
  };

  const getCategoryColor = (category: POI['category']) => {
    const colorMap = {
      viewpoint: '#3B82F6',
      water: '#06B6D4',
      nature: '#10B981',
      culture: '#8B5CF6',
      trail: '#F59E0B',
      restaurant: '#EF4444',
      accommodation: '#166534'
    };
    return colorMap[category] || '#6B7280';
  };

  useEffect(() => {
    if (!map || !map.getContainer()) return;

    const markers: L.Marker[] = [];

    // Create custom cabin icon
    const cabinIcon = L.divIcon({
      html: `
        <div style="
          background: #166534;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        ">
          🏠
        </div>
      `,
      className: 'custom-cabin-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });

    // Add cabin marker
    const cabinMarker = L.marker([cabinLocation.latitude, cabinLocation.longitude], { 
      icon: cabinIcon 
    }).addTo(map);

    cabinMarker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #166534; font-weight: bold;">Chatka Glumeček</h3>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          Váš útulný pobyt v srdci Brdských lesů
        </p>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <a href="/rezervace" style="
            background: #166534;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
            font-weight: bold;
          ">Rezervovat</a>
          <a href="#ubytovani" style="
            background: #f3f4f6;
            color: #374151;
            padding: 6px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
          ">Více info</a>
        </div>
      </div>
    `);

    markers.push(cabinMarker);

    // Add POI markers
    pois.forEach(poi => {
      const poiIcon = L.divIcon({
        html: `
          <div style="
            background: ${getCategoryColor(poi.category)};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">
            ${getCategoryIcon(poi.category)}
          </div>
        `,
        className: `custom-poi-marker poi-${poi.category}`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([poi.latitude, poi.longitude], { 
        icon: poiIcon 
      }).addTo(map);

      const popupContent = `
        <div style="min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: ${getCategoryColor(poi.category)}; font-weight: bold;">
            ${poi.name}
          </h3>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
            <span style="color: #666; font-size: 12px;">📍 ${poi.distance} od chatky</span>
          </div>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px; line-height: 1.4;">
            ${poi.description}
          </p>
          <div style="display: flex; gap: 8px;">
            <a href="https://www.google.com/maps/dir//${poi.latitude},${poi.longitude}" 
               target="_blank" 
               style="
                 background: #1f2937;
                 color: white;
                 padding: 6px 12px;
                 border-radius: 4px;
                 text-decoration: none;
                 font-size: 12px;
               ">
              🧭 Navigace
            </a>
            ${poi.website ? `
              <a href="${poi.website}" 
                 target="_blank" 
                 style="
                   background: #f3f4f6;
                   color: #374151;
                   padding: 6px 12px;
                   border-radius: 4px;
                   text-decoration: none;
                   font-size: 12px;
                 ">
                🌐 Web
              </a>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markers.push(marker);
    });

    // Cleanup function
    return () => {
      markers.forEach(marker => {
        map.removeLayer(marker);
      });
    };
  }, [map, pois, cabinLocation]);

  return null;
};

export default InteractiveMapMarkers;
