import { MountainIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background sticky top-0 z-50 border-b">
      <a className="flex items-center justify-center" href="#">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">My Portfolio</span>
      </a>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#projects">
          Projects
        </a>
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  );
};

export default Header;