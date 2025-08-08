import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="py-6 px-4 md:px-8 lg:px-16 bg-background/80 sticky top-0 z-50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Jane Doe
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
            <Button asChild>
                <a href="mailto:hello@janedoe.com">Get in Touch</a>
            </Button>
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
                    <Button variant="outline" onClick={handleLogout} className="mt-4">Logout</Button>
                  </>
                ) : (
                  <Button asChild className="mt-4">
                      <a href="mailto:hello@janedoe.com">Get in Touch</a>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};