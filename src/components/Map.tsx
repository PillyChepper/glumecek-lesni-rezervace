
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

// Convert degrees, minutes, seconds to decimal degrees
const dmsToDecimal = (degrees: number, minutes: number, seconds: number, direction: string): number => {
  let decimal = degrees + minutes/60 + seconds/3600;
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  return decimal;
};

const Map: React.FC<MapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 13,
  height = '300px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  
  const mapContainerStyle = {
    width: '100%',
    height,
    borderRadius: '0.5rem',
  };
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;

  useEffect(() => {
    // Skip if already initialized or container not ready
    if (mapInitialized.current || !mapContainerRef.current) return;
    
    // Load Mapy.cz API script
    const loadMapyApi = () => {
      const script = document.createElement('script');
      script.src = 'https://api.mapy.cz/loader.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        // Initialize the API with our key
        window.Loader.apiKey = 'S8oj5YoEgR-XJcZIM6JGQqiNbvCH1HerrfXwWNqNrGo';
        window.Loader.load(null, { suggest: true }, initializeMap);
      };
      
      script.onerror = () => {
        console.error('Failed to load Mapy.cz API');
      };
    };
    
    // Initialize map after API loads
    const initializeMap = () => {
      if (!mapContainerRef.current || !window.SMap) return;
      
      // Create map centered on our coordinates
      const center = window.SMap.Coords.fromWGS84(longitude, latitude);
      const map = new window.SMap(mapContainerRef.current, center, zoom);
      
      // Add controls
      map.addDefaultLayer(window.SMap.DEF_BASE);
      map.addDefaultControls();
      
      // Add marker at specified location
      const layer = new window.SMap.Layer.Marker();
      map.addLayer(layer);
      layer.enable();
      
      const marker = new window.SMap.Marker(center);
      layer.addMarker(marker);
      
      // Set flag to prevent re-initialization
      mapInitialized.current = true;
    };
    
    loadMapyApi();
    
    // Cleanup function
    return () => {
      const script = document.querySelector('script[src="https://api.mapy.cz/loader.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div 
      style={mapContainerStyle}
      className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200"
    >
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }}
        className="relative rounded-lg overflow-hidden"
      />
      {/* Fallback only shows if map fails to load */}
      <div id="map-fallback" className="hidden absolute inset-0 text-center p-6 bg-gray-100">
        <MapPin size={32} className="text-forest-600 mx-auto mb-3" />
        <h4 className="text-lg font-medium mb-2">Zobrazit mapu</h4>
        <p className="text-sm text-gray-600 mb-4">
          Pro zobrazení interaktivní mapy klikněte na tlačítko níže.
        </p>
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-forest-600 hover:bg-forest-700 text-white px-4 py-2 rounded transition-colors inline-flex items-center"
        >
          <MapPin size={18} className="mr-2" />
          Otevřít v Google Maps
        </a>
      </div>
    </div>
  );
};

export default Map;
