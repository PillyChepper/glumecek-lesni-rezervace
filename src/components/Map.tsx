
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

const Map: React.FC<MapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 13,
  height = '300px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
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
    
    // Declare script outside to allow access in cleanup
    let scriptElement: HTMLScriptElement | null = null;

    const loadMapyApi = () => {
      try {
        // Check if script already exists to prevent duplication
        const existingScript = document.querySelector('script[src="https://api.mapy.cz/loader.js"]');
        
        if (existingScript) {
          // If script already exists, try to initialize the map directly
          if (window.Loader) {
            window.Loader.apiKey = 'S8oj5YoEgR-XJcZIM6JGQqiNbvCH1HerrfXwWNqNrGo';
            window.Loader.load(null, { suggest: true }, initializeMap);
          } else {
            console.error('Mapy.cz Loader exists but is not available');
            setMapError(true);
          }
          return;
        }

        // Create and add the script
        scriptElement = document.createElement('script');
        scriptElement.src = 'https://api.mapy.cz/loader.js';
        scriptElement.async = true;
        
        scriptElement.onload = () => {
          console.log('Mapy.cz script loaded');
          // Initialize the API with our key
          if (window.Loader) {
            console.log('Loader found, initializing with API key');
            window.Loader.apiKey = 'S8oj5YoEgR-XJcZIM6JGQqiNbvCH1HerrfXwWNqNrGo';
            window.Loader.load(null, { suggest: true }, () => {
              console.log('Loader.load callback executed');
              initializeMap();
            });
          } else {
            console.error('Mapy.cz Loader not available after script load');
            setMapError(true);
          }
        };
        
        scriptElement.onerror = () => {
          console.error('Failed to load Mapy.cz API');
          setMapError(true);
        };
        
        document.body.appendChild(scriptElement);
      } catch (error) {
        console.error('Error loading Mapy.cz API:', error);
        setMapError(true);
      }
    };
    
    // Initialize map after API loads
    const initializeMap = () => {
      try {
        console.log('Initializing map');
        if (!mapContainerRef.current) {
          console.error('Map container ref is not available');
          setMapError(true);
          return;
        }
        
        if (!window.SMap) {
          console.error('SMap is not available');
          setMapError(true);
          return;
        }
        
        // Create map centered on our coordinates
        console.log('Creating map with coords:', longitude, latitude);
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
        setIsMapLoaded(true);
        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };
    
    // Start loading the map API
    console.log('Starting to load Mapy.cz API');
    loadMapyApi();
    
    // Cleanup function
    return () => {
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [latitude, longitude, zoom]);

  // If there's an error, show the fallback
  if (mapError) {
    console.log('Showing map error fallback');
    return (
      <div 
        style={mapContainerStyle}
        className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200"
      >
        <div className="text-center p-6">
          <MapPin size={32} className="text-forest-600 mx-auto mb-3" />
          <h4 className="text-lg font-medium mb-2">Zobrazit mapu</h4>
          <p className="text-sm text-gray-600 mb-4">
            Načítání mapy selhalo. Pro zobrazení mapy klikněte na tlačítko níže.
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
  }

  // Add a loading state
  if (!isMapLoaded) {
    return (
      <div 
        style={mapContainerStyle}
        className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200"
      >
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám mapu...</p>
        </div>
      </div>
    );
  }

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
    </div>
  );
};

export default Map;
