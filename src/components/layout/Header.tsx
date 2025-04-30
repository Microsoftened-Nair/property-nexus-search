
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-navy-800 text-white p-2 rounded">
              <Search size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-800">Property Nexus</h1>
              <p className="text-xs text-muted-foreground">Unified Search Portal</p>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-navy-800 hover:text-navy-600 font-medium">Home</Link>
          <Link to="/search" className="text-navy-800 hover:text-navy-600 font-medium">Advanced Search</Link>
          <Link to="/dashboard" className="text-navy-800 hover:text-navy-600 font-medium">Dashboard</Link>
        </nav>

        {/* <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="border-navy-800 text-navy-800 hover:bg-navy-100"
          >
            Log In
          </Button>
          <Button className="bg-navy-800 text-white hover:bg-navy-700">
            Register
          </Button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
