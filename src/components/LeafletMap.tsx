
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Skip if map already initialized or container not ready
    if (mapInstanceRef.current || !mapRef.current) return;

    // Define API key
    const API_KEY = 'S8oj5YoEgR-XJcZIM6JGQqiNbvCH1HerrfXwWNqNrGo';

    try {
      // Create map instance
      const map = L.map(mapRef.current).setView([latitude, longitude], zoom);
      mapInstanceRef.current = map;

      // Create tile layers
      const tileLayers = {
        'Basic': L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
          minZoom: 0,
          maxZoom: 19,
          attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
        }),
        'Outdoor': L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
          minZoom: 0,
          maxZoom: 19,
          attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
        }),
        'Winter': L.tileLayer(`https://api.mapy.cz/v1/maptiles/winter/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
          minZoom: 0,
          maxZoom: 19,
          attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
        }),
        'Aerial': L.tileLayer(`https://api.mapy.cz/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
          minZoom: 0,
          maxZoom: 19,
          attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
        }),
      };

      // Add the aerial layer as default
      tileLayers['Aerial'].addTo(map);

      // Add layers control
      L.control.layers(tileLayers).addTo(map);

      // Fix for default marker icon paths in Leaflet
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Add marker at the location with fixed icon
      L.marker([latitude, longitude], { icon: defaultIcon }).addTo(map);

      // Format coordinates for Mapy.cz URL
      // Mapy.cz uses format: https://mapy.cz/zakladni?x=13.8453900&y=49.5867500&z=15
      const mapyCzUrl = `https://mapy.cz/zakladni?x=${longitude.toFixed(7)}&y=${latitude.toFixed(7)}&z=${zoom}`;

      // Add the Mapy.cz logo with direct link to coordinates
      const LogoControl = L.Control.extend({
        options: {
          position: 'bottomleft',
        },
        onAdd: function () {
          const container = L.DomUtil.create('div');
          const link = L.DomUtil.create('a', '', container);
          
          link.setAttribute('href', mapyCzUrl);
          link.setAttribute('target', '_blank');
          link.setAttribute('title', 'Otevřít tuto lokaci na Mapy.cz');
          link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" />';
          L.DomEvent.disableClickPropagation(link);
          
          return container;
        },
      });

      // Add logo control
      new LogoControl().addTo(map);

      // Ensure map is refreshed when container size changes
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

    } catch (error) {
      import('@/utils/logger').then(({ logger }) => {
        logger.error('Error initializing Leaflet map:', error);
      });
    }

    // Cleanup on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }} 
      className="rounded-lg overflow-hidden"
    />
  );
};

export default LeafletMap;
