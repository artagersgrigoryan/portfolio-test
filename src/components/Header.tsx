import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, PlusCircle, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); // Hide header
      } else {
        setIsVisible(true); // Show header
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`py-6 px-10 bg-background/80 sticky top-0 z-50 backdrop-blur-sm border-b border-border transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Artagers Grigoryan
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/projects" className="text-gray-300 hover:text-primary transition-colors">
            Projects
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/add-project">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Project
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                  <a href="mailto:artagersgrigoryan@gmail.com">Get in Touch</a>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-6 mt-12 text-lg">
                <Link to="/projects" className="text-gray-300 hover:text-primary transition-colors">Projects</Link>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About</Link>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</Link>
                {user ? (
                  <>
                    <Link to="/add-project" className="text-gray-300 hover:text-primary transition-colors">Add Project</Link>
                    <Button variant="outline" onClick={handleLogout} className="mt-4">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4 mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                        <a href="mailto:artagersgrigoryan@gmail.com">Get in Touch</a>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};