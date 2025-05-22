
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapContainerStyle = {
    width: '100%',
    height,
    borderRadius: '0.5rem',
  };
  
  const center = {
    lat: latitude,
    lng: longitude
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg" // This is a Google's sample API key for development purposes
      onLoad={() => setMapLoaded(true)}
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
