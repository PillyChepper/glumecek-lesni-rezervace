
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Button } from '@/components/ui/button';

const ReservationCTASection = () => {
  return (
    <Section id="rezervace" className="py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="section-title">
          Máte zájem o pobyt v našem lesním domku?
        </h2>
        <p className="section-subtitle mb-8">
          Rezervujte si svůj termín!
        </p>
        
        <Link to="/rezervace">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-4 rounded-md text-lg">
            Přejít na rezervace
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default ReservationCTASection;
