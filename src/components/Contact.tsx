import { Button } from "@/components/ui/button";
import { Dribbble, Github, Linkedin, Mail, Phone } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-card">
      <div className="max-w-screen-xl mx-auto px-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Let's build something great together</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Have a project in mind? I'm currently available for freelance work. Let's talk.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Button size="lg" asChild>
              <a href="mailto:artagersgrigoryan@gmail.com" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                artagersgrigoryan@gmail.com
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="tel:+37498718748" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                +374 98 718 748
              </a>
            </Button>
        </div>
        <div className="flex justify-center gap-6">
          <a href="https://dribbble.com/ArtagErs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Dribbble className="h-8 w-8" /></a>
          <a href="https://github.com/ArtagErs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Github className="h-8 w-8" /></a>
          <a href="https://www.linkedin.com/in/artagers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="h-8 w-8" /></a>
        </div>
      </div>
    </section>
  );
};