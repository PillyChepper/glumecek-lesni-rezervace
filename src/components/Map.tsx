
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
  // Since the sample API key isn't working, let's skip the loading attempt and directly show the fallback
  const mapContainerStyle = {
    width: '100%',
    height,
    borderRadius: '0.5rem',
  };
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;

  // Always show the fallback with a link to Google Maps since the API key isn't configured for this domain
  return (
    <div 
      style={mapContainerStyle}
      className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200"
    >
      <div className="text-center p-6">
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
