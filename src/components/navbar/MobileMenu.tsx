
import { Menu, X, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  handleSmoothScroll: (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenu = ({ isMenuOpen, toggleMenu, handleSmoothScroll, setIsMenuOpen }: MobileMenuProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <button 
        className="md:hidden text-forest-800"
        onClick={toggleMenu}
        aria-label="Menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {isHomePage ? (
            <>
              <a 
                href="#o-nas" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={(e) => handleSmoothScroll(e, "o-nas")}
              >
                O nás
              </a>
              <a 
                href="#ubytovani" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={(e) => handleSmoothScroll(e, "ubytovani")}
              >
                Ubytování
              </a>
              <a 
                href="#lokalita" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={(e) => handleSmoothScroll(e, "lokalita")}
              >
                Lokalita
              </a>
              <a 
                href="#cenik" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={(e) => handleSmoothScroll(e, "cenik")}
              >
                Ceník
              </a>
            </>
          ) : (
            <>
              <Link
                to="/#o-nas" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                O nás
              </Link>
              <Link
                to="/#ubytovani" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Ubytování
              </Link>
              <Link
                to="/#lokalita" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Lokalita
              </Link>
              <Link
                to="/#cenik" 
                className="text-forest-800 py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Ceník
              </Link>
            </>
          )}
          <Link 
            to="/rezervace"
            className="text-forest-800 py-2 border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Rezervace
          </Link>
          <Link 
            to="/admin"
            onClick={() => setIsMenuOpen(false)}
            className="text-forest-800 py-2 border-b border-gray-100 flex items-center gap-2"
          >
            <Shield size={16} />
            Admin
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
