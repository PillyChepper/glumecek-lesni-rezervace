
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar } from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-2 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-forest-800 font-semibold mr-6">Admin Dashboard</h1>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant={currentPath === "/admin" ? "default" : "outline"} 
              size="sm" 
              asChild
            >
              <Link to="/admin" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Rezervace
              </Link>
            </Button>
            
            <Button 
              variant={currentPath === "/admin/clients" ? "default" : "outline"} 
              size="sm" 
              asChild
            >
              <Link to="/admin/clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Klienti
              </Link>
            </Button>
          </div>
        </div>
        
        <Button variant="outline" size="sm" asChild>
          <a href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Veřejný web
          </a>
        </Button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
