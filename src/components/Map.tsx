
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, LoadScriptProps } from '@react-google-maps/api';
import { MapPin, AlertCircle } from 'lucide-react';

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  const mapContainerStyle = {
    width: '100%',
    height,
    borderRadius: '0.5rem',
  };
  
  const center = {
    lat: latitude,
    lng: longitude
  };

  const handleError: LoadScriptProps["onError"] = () => {
    console.error("Google Maps failed to load");
    setMapError(true);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;

  // If we have an error, show a fallback with a link to Google Maps
  if (mapError) {
    return (
      <div 
        style={mapContainerStyle}
        className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200"
      >
        <div className="text-center p-6">
          <AlertCircle size={32} className="text-amber-500 mx-auto mb-3" />
          <h4 className="text-lg font-medium mb-2">Mapa se nepodařila načíst</h4>
          <p className="text-sm text-gray-600 mb-4">
            Pro zobrazení mapy prosím klikněte na odkaz níže.
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

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg" // This is a Google's sample API key for development purposes
      onLoad={() => setMapLoaded(true)}
      onError={handleError}
    >
      <div className="relative rounded-lg overflow-hidden shadow-md">
        {mapLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div 
            style={mapContainerStyle}
            className="flex items-center justify-center bg-gray-100"
          >
            <div className="animate-pulse flex flex-col items-center">
              <MapPin size={24} className="text-forest-600" />
              <p className="text-sm text-gray-500 mt-2">Načítání mapy...</p>
            </div>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default Map;
