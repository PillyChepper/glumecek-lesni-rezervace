
import Section from '@/components/Section';

const PricingSection = () => {
  return (
    <Section id="cenik" bgColor="bg-forest-50" className="px-4">
      <h2 className="section-title text-center">Ceník</h2>
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-2xl font-display font-medium mb-2">Základní informace</h3>
            <p className="text-muted-foreground">
              Cena zahrnuje ubytování pro 2 osoby, parkování, povlečení, ručníky a závěrečný úklid.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span>Základní cena za noc</span>
              <span className="font-medium">2 500 Kč</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Minimální délka pobytu</span>
              <span className="font-medium">2 noci</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Domácí mazlíček</span>
              <span className="font-medium">200 Kč</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span>Check-in</span>
              <span className="font-medium">od 14:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Check-out</span>
              <span className="font-medium">do 11:00</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PricingSection;
