/**
 * Global type definitions for external libraries and window objects
 */

declare global {
  interface Window {
    // Mapy.cz API types
    Loader?: {
      apiKey: string;
      load: (
        apiVersion: string | null, 
        options: { suggest: boolean }, 
        callback: () => void
      ) => void;
    };
    
    SMap?: {
      Coords: {
        fromWGS84: (lon: number, lat: number) => MapyCoordinates;
      };
      DEF_BASE: string;
      Layer: {
        Marker: new () => MapyMarkerLayer;
      };
      Marker: new (coords: MapyCoordinates, options?: MapyMarkerOptions) => MapyMarker;
      new (element: HTMLElement, coords: MapyCoordinates, zoom: number): MapyMap;
    };
  }
  
  // Mapy.cz specific types
  interface MapyCoordinates {
    x: number;
    y: number;
  }
  
  interface MapyMap {
    addDefaultLayer: (layer: string) => void;
    addDefaultControls: () => void;
    addLayer: (layer: MapyMarkerLayer) => void;
  }
  
  interface MapyMarker {
    decorate: (decoration: MapyDecoration) => void;
  }
  
  interface MapyMarkerLayer {
    addMarker: (marker: MapyMarker) => void;
  }
  
  interface MapyMarkerOptions {
    url?: string;
    anchor?: {
      left: number;
      bottom: number;
    };
  }
  
  interface MapyDecoration {
    new (title: string, description?: string, options?: any): any;
  }
}

// This export statement makes this file a module
export {};