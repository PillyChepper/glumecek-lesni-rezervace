
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressSectionProps {
  street: string;
  setStreet: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
}

const AddressSection = ({
  street,
  setStreet,
  city,
  setCity,
  postalCode,
  setPostalCode
}: AddressSectionProps) => {
  return (
    <Card className="border-t-4 border-t-forest-600">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-5 w-5 text-forest-600 mr-2" />
          <CardTitle className="text-lg">Adresa</CardTitle>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Ulice a č.p.</Label>
            <Input
              id="address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Zadejte ulici a číslo popisné"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Město</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Zadejte město"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal-code">PSČ</Label>
              <Input
                id="postal-code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Zadejte PSČ"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSection;
