import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 lg:px-16 bg-card">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Let's Create Something Amazing</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          I'm currently available for freelance projects and full-time opportunities. If you have a project in mind or just want to say hello, feel free to get in touch.
        </p>
        <Button size="lg" asChild>
          <a href="mailto:hello@janedoe.com">hello@janedoe.com</a>
        </Button>
        <div className="flex justify-center gap-6 mt-12">
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter className="h-8 w-8" /></a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Github className="h-8 w-8" /></a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="h-8 w-8" /></a>
        </div>
      </div>
    </section>
  );
};