import { Button } from "@/components/ui/button";
import { Dribbble, Github, Linkedin } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 lg:px-16 bg-card">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Let's build something great together</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Have a project in mind? I'm currently available for freelance work. Let's talk.
        </p>
        <Button size="lg" asChild>
          <a href="mailto:hello@artagers.com">hello@artagers.com</a>
        </Button>
        <div className="flex justify-center gap-6 mt-12">
          <a href="https://dribbble.com/ArtagErs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Dribbble className="h-8 w-8" /></a>
          <a href="https://github.com/ArtagErs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Github className="h-8 w-8" /></a>
          <a href="https://www.linkedin.com/in/artagers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="h-8 w-8" /></a>
        </div>
      </div>
    </section>
  );
};