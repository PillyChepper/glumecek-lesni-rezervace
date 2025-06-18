import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
      
      // Close the mobile menu if it's open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'py-4 bg-white/30 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="text-forest-800 font-display text-xl md:text-2xl font-semibold">
          Glumeček
        </a>
        
        <div className="hidden md:flex items-center space-x-6">
          {isHomePage ? (
            <>
              <a 
                href="#o-nas" 
                className="text-forest-800 hover:text-forest-600 transition-colors"
                onClick={(e) => handleSmoothScroll(e, "o-nas")}
              >
                O nás
              </a>
              <a 
                href="#ubytovani" 
                className="text-forest-800 hover:text-forest-600 transition-colors"
                onClick={(e) => handleSmoothScroll(e, "ubytovani")}
              >
                Ubytování
              </a>
              <a 
                href="#lokalita" 
                className="text-forest-800 hover:text-forest-600 transition-colors"
                onClick={(e) => handleSmoothScroll(e, "lokalita")}
              >
                Lokalita
              </a>
              <a 
                href="#cenik" 
                className="text-forest-800 hover:text-forest-600 transition-colors"
                onClick={(e) => handleSmoothScroll(e, "cenik")}
              >
                Ceník
              </a>
            </>
          ) : (
            <>
              <Link to="/#o-nas" className="text-forest-800 hover:text-forest-600 transition-colors">
                O nás
              </Link>
              <Link to="/#ubytovani" className="text-forest-800 hover:text-forest-600 transition-colors">
                Ubytování
              </Link>
              <Link to="/#lokalita" className="text-forest-800 hover:text-forest-600 transition-colors">
                Lokalita
              </Link>
              <Link to="/#cenik" className="text-forest-800 hover:text-forest-600 transition-colors">
                Ceník
              </Link>
            </>
          )}
          <Link to="/rezervace" className="text-forest-800 hover:text-forest-600 transition-colors">
            Rezervace
          </Link>
          <Link to="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <Shield size={16} />
              Admin
            </Button>
          </Link>
        </div>

        <button 
          className="md:hidden text-forest-800"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
    </nav>
  );
};

export default Navbar;
