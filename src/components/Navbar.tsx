
import { useState, useEffect } from 'react';
import NavbarBrand from './navbar/NavbarBrand';
import NavbarLinks from './navbar/NavbarLinks';
import NavbarAdminButton from './navbar/NavbarAdminButton';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <NavbarBrand />
        <NavbarLinks handleSmoothScroll={handleSmoothScroll} />
        <NavbarAdminButton />
        <MobileMenu 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          handleSmoothScroll={handleSmoothScroll}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;
