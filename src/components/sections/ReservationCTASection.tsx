
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

const ReservationCTASection = () => {
  return (
    <Section id="rezervace" className="py-16 bg-green-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-6 text-forest-800">
          Máte zájem o pobyt v našem lesním domku? Rezervujte si svůj termín!
        </h2>
        
        <p className="mb-8 text-forest-700 max-w-2xl mx-auto">
          Vyberte si ideální termín pro váš odpočinek v přírodě. Stačí kliknout na tlačítko níže a přejít na rezervační systém.
        </p>
        
        <Link to="/rezervace">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-4 rounded-md text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Přejít na rezervace
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default ReservationCTASection;
