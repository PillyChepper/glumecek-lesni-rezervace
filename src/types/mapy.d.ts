
interface Window {
  Loader: {
    apiKey: string;
    load: (
      apiVersion: string | null, 
      options: { suggest: boolean }, 
      callback: () => void
    ) => void;
  };
  SMap: {
    Coords: {
      fromWGS84: (lon: number, lat: number) => any;
    };
    DEF_BASE: string;
    Layer: {
      Marker: new () => any;
    };
    Marker: new (coords: any, options?: any) => any;
    new (element: HTMLElement, coords: any, zoom: number): {
      addDefaultLayer: (layer: string) => void;
      addDefaultControls: () => void;
      addLayer: (layer: any) => void;
    };
  };
}
