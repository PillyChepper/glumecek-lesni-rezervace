
import { Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const NavbarAdminButton = () => {
  return (
    <div className="hidden md:flex">
      <Link to="/admin">
        <Button variant="outline" className="flex items-center gap-2">
          <Shield size={16} />
          Admin
        </Button>
      </Link>
    </div>
  );
};

export default NavbarAdminButton;
