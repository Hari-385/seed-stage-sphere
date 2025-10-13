import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">StartupConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/browse") ? "text-primary" : "text-foreground"
              }`}
            >
              Browse Startups
            </Link>
            <Link 
              to="/resources" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/resources") ? "text-primary" : "text-foreground"
              }`}
            >
              Resources
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="btn-hero">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/browse" 
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive("/browse") ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Startups
              </Link>
              <Link 
                to="/resources" 
                className={`font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive("/resources") ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="btn-hero w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
