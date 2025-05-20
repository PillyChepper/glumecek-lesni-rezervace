
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

interface ReservationContactInfoProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  // New address fields
  street: string;
  setStreet: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
}

const ReservationContactInfo = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  street,
  setStreet,
  city,
  setCity,
  postalCode,
  setPostalCode
}: ReservationContactInfoProps) => {
  // Google Maps API key state
  const [apiKey, setApiKey] = useState<string>('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

  // Effect to check for API key in localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  // Handle API key input
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
  };

  // Save API key to localStorage
  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('google_maps_api_key', apiKey);
      setIsApiKeySet(true);
    }
  };

  // Handle place selection from autocomplete
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      
      if (place.address_components) {
        // Extract address components
        for (const component of place.address_components) {
          const componentType = component.types[0];
          
          switch (componentType) {
            case "street_number": {
              const streetNumber = component.long_name;
              setStreet(prev => `${streetNumber} ${prev.split(' ').slice(1).join(' ')}`);
              break;
            }
            case "route": {
              const street = component.long_name;
              setStreet(prev => {
                const parts = prev.split(' ');
                if (parts.length > 1) {
                  return `${parts[0]} ${street}`;
                }
                return street;
              });
              break;
            }
            case "postal_code": {
              setPostalCode(component.long_name);
              break;
            }
            case "locality":
              setCity(component.long_name);
              break;
          }
        }
      }
      
      // If we didn't get structured data, use the formatted address
      if (place.formatted_address && (!street || !city)) {
        const addressParts = place.formatted_address.split(',');
        if (addressParts.length >= 1 && !street) {
          setStreet(addressParts[0].trim());
        }
        if (addressParts.length >= 2 && !city) {
          setCity(addressParts[1].trim());
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card className="border-t-4 border-t-forest-600">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-forest-600 mr-2" />
            <CardTitle className="text-lg">Osobní údaje</CardTitle>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">Jméno *</Label>
              <Input 
                id="first-name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Příjmení *</Label>
              <Input 
                id="last-name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center mb-1">
              <Mail className="h-4 w-4 text-forest-600 mr-2" />
              <Label htmlFor="email">Email *</Label>
            </div>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center mb-1">
              <Phone className="h-4 w-4 text-forest-600 mr-2" />
              <Label htmlFor="phone">Telefon *</Label>
            </div>
            <Input 
              id="phone" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card className="border-t-4 border-t-forest-600">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-forest-600 mr-2" />
            <CardTitle className="text-lg">Adresa</CardTitle>
          </div>
          
          {!isApiKeySet ? (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
              <p className="text-sm text-amber-800 mb-3">Pro použití automatického vyplnění adresy je potřeba vložit Google Maps API klíč:</p>
              <div className="flex gap-2">
                <Input 
                  value={apiKey} 
                  onChange={handleApiKeyChange}
                  placeholder="Vložte Google Maps API klíč" 
                  className="text-xs"
                />
                <button 
                  onClick={saveApiKey}
                  className="bg-forest-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Uložit
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                API klíč bude uložen pouze ve vašem prohlížeči.
              </p>
            </div>
          ) : (
            <LoadScript
              googleMapsApiKey={apiKey}
              libraries={["places"]}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Ulice a č.p.</Label>
                  <Autocomplete
                    onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      componentRestrictions: { country: "cz" },
                      types: ["address"]
                    }}
                  >
                    <Input
                      id="address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Začněte psát adresu..."
                    />
                  </Autocomplete>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Město</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">PSČ</Label>
                    <Input
                      id="postal-code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </LoadScript>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationContactInfo;
