
import Section from '@/components/Section';
import Feature from '@/components/Feature';
import { Utensils, Droplets, Wifi, Thermometer, PawPrint, MapPin } from 'lucide-react';

const AccommodationSection = () => {
  return (
    <Section id="ubytovani" bgColor="bg-forest-50">
      <h2 className="section-title text-center">Ubytování</h2>
      <p className="text-center max-w-3xl mx-auto mb-12">
        Náš domek je kompletně vybaven vším, co potřebujete pro pohodlný pobyt v přírodě. Spojení moderního komfortu s rustikálním prostředím vám zaručí nezapomenutelný zážitek.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Feature 
          icon={<Utensils size={32} />}
          title="Plně vybavená kuchyň"
          description="Vařič, lednice, základní kuchyňské vybavení a vše potřebné pro přípravu jídla."
        />
        <Feature 
          icon={<Droplets size={32} />}
          title="Koupelna se sprchou"
          description="Vlastní koupelna s teplou vodou a ekologickými toaletními potřebami."
        />
        <Feature 
          icon={<Wifi size={32} />}
          title="Wi-Fi připojení"
          description="Pro ty, kteří potřebují zůstat ve spojení i uprostřed lesa."
        />
        <Feature 
          icon={<Thermometer size={32} />}
          title="Vytápění"
          description="Kamna na dřevo pro příjemné teplo během chladných večerů."
        />
        <Feature 
          icon={<PawPrint size={32} />}
          title="Pet friendly"
          description="Vaši čtyřnozí přátelé jsou u nás vítáni. Les je ideálním místem pro jejich radost."
        />
        <Feature 
          icon={<MapPin size={32} />}
          title="Soukromí v přírodě"
          description="Žádní sousedé, jen vy a les kolem. Dokonalé místo pro odpočinek a relaxaci."
        />
      </div>
    </Section>
  );
};

export default AccommodationSection;
