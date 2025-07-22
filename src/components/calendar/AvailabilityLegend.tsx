
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AvailabilityLegend = () => {
  const legendItems = [
    {
      status: 'available',
      label: 'Volné',
      className: 'bg-forest-100 text-forest-700 border border-forest-200',
      description: 'Dostupné pro rezervaci'
    },
    {
      status: 'booked',
      label: 'Obsazeno',
      className: 'bg-red-100 text-red-700 border border-red-200',
      description: 'Již rezervováno'
    },
    {
      status: 'selected',
      label: 'Vybrané',
      className: 'bg-forest-600 text-white',
      description: 'Váš vybraný termín'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Legenda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded text-xs flex items-center justify-center ${item.className}`}>
              15
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AvailabilityLegend;
