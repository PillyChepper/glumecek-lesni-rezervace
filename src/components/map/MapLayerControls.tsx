
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Waves, TreePine, Mountain, Coffee, Utensils, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LayerControlsProps {
  map: L.Map | null;
}

const MapLayerControls = ({ map }: LayerControlsProps) => {
  const [visibleLayers, setVisibleLayers] = useState({
    viewpoints: true,
    water: true,
    nature: true,
    culture: true,
    trails: true,
    restaurants: true
  });

  const layerCategories = [
    { 
      key: 'viewpoints', 
      label: 'Vyhlídky', 
      icon: <Camera className="h-3 w-3" />, 
      color: '#3B82F6',
      count: 2
    },
    { 
      key: 'water', 
      label: 'Vodní plochy', 
      icon: <Waves className="h-3 w-3" />, 
      color: '#06B6D4',
      count: 1
    },
    { 
      key: 'nature', 
      label: 'Příroda', 
      icon: <TreePine className="h-3 w-3" />, 
      color: '#10B981',
      count: 2
    },
    { 
      key: 'culture', 
      label: 'Kultura', 
      icon: <Mountain className="h-3 w-3" />, 
      color: '#8B5CF6',
      count: 1
    },
    { 
      key: 'trails', 
      label: 'Stezky', 
      icon: <Mountain className="h-3 w-3" />, 
      color: '#F59E0B',
      count: 1
    },
    { 
      key: 'restaurants', 
      label: 'Restaurace', 
      icon: <Utensils className="h-3 w-3" />, 
      color: '#EF4444',
      count: 0
    }
  ];

  const toggleLayer = (layerKey: string) => {
    if (!map) return;

    const newVisibility = !visibleLayers[layerKey as keyof typeof visibleLayers];
    
    setVisibleLayers(prev => ({
      ...prev,
      [layerKey]: newVisibility
    }));

    // Toggle markers visibility
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const markerElement = layer.getElement();
        if (markerElement && markerElement.classList.contains(`poi-${layerKey.slice(0, -1)}`)) {
          if (newVisibility) {
            markerElement.style.display = 'block';
          } else {
            markerElement.style.display = 'none';
          }
        }
      }
    });
  };

  return (
    <Card className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm shadow-lg">
      <CardContent className="p-3">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Vrstvy mapy</h4>
          {layerCategories.map((category) => (
            <Button
              key={category.key}
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 h-8 ${
                visibleLayers[category.key as keyof typeof visibleLayers]
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500'
              }`}
              onClick={() => toggleLayer(category.key)}
            >
              <div 
                className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: category.color }}
              >
                {visibleLayers[category.key as keyof typeof visibleLayers] ? (
                  <Eye className="h-2 w-2 text-white" />
                ) : (
                  <EyeOff className="h-2 w-2 text-white" />
                )}
              </div>
              <span className="text-xs flex-1 text-left">{category.label}</span>
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLayerControls;
