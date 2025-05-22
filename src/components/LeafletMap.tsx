
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
    const API_KEY = 'eyJpIjoyNTcsImMiOjE2Njc0ODU2MjN9.c_UlvdpHGTI_Jb-TNMYlDYuIkCLJaUpi911RdlwPsAY';

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

      // Add the outdoor layer as default
      tileLayers['Outdoor'].addTo(map);

      // Add layers control
      L.control.layers(tileLayers).addTo(map);

      // Add marker at the location
      L.marker([latitude, longitude]).addTo(map);

      // Add the Mapy.cz logo
      const LogoControl = L.Control.extend({
        options: {
          position: 'bottomleft',
        },
        onAdd: function () {
          const container = L.DomUtil.create('div');
          const link = L.DomUtil.create('a', '', container);
          
          link.setAttribute('href', 'http://mapy.cz/');
          link.setAttribute('target', '_blank');
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
      console.error('Error initializing Leaflet map:', error);
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
