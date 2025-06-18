
import { Link, useLocation } from 'react-router-dom';

interface NavbarLinksProps {
  handleSmoothScroll: (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const NavbarLinks = ({ handleSmoothScroll }: NavbarLinksProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="hidden md:flex items-center justify-center flex-1 mx-8">
      <div className="flex items-center space-x-6">
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
      </div>
    </div>
  );
};

export default NavbarLinks;
