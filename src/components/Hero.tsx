import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-89px)] flex items-center justify-center text-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
          Crafting Digital Experiences that
          <br />
          <span className="text-primary">Inspire & Engage</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          I'm Jane Doe, a passionate UX/UI designer dedicated to creating intuitive, beautiful, and user-centered designs that solve real-world problems.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#projects">
            <Button size="lg">
              View My Work <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};