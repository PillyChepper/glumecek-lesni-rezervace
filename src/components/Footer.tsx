
import { MapPin, Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Glumeček</h3>
            <p className="mb-4 text-gray-300">
              Zažijte jedinečné ubytování v srdci brdských lesů. Odpojte se od každodenního ruchu a ponořte se do klidu přírody.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-forest-300 transition-colors" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-white hover:text-forest-300 transition-colors" aria-label="Facebook">
                <Facebook />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Kontakt</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-forest-400" />
                <span>Brdy, Středočeský kraj, Česká republika</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-forest-400" />
                <a href="mailto:info@glumecek.cz" className="hover:text-white">info@glumecek.cz</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-forest-400" />
                <a href="tel:+420123456789" className="hover:text-white">+420 123 456 789</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#o-nas" className="hover:text-white transition-colors">O nás</a>
              </li>
              <li>
                <a href="#ubytovani" className="hover:text-white transition-colors">Ubytování</a>
              </li>
              <li>
                <a href="#lokalita" className="hover:text-white transition-colors">Lokalita</a>
              </li>
              <li>
                <a href="#cenik" className="hover:text-white transition-colors">Ceník</a>
              </li>
              <li>
                <a href="/rezervace" className="hover:text-white transition-colors">Rezervace</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Glumeček. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
