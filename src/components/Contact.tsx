import { Dribbble, Github, Linkedin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-card">
      <div className="max-w-screen-xl mx-auto px-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Let's build something great together</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          Have a project in mind or just want to say hi? Fill out the form below and I'll get back to you.
        </p>
        
        <ContactForm />

        <div className="flex justify-center gap-6 mt-16">
          <a href="https://dribbble.com/ArtagErs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Dribbble className="h-8 w-8" /></a>
          <a href="https://github.com/ArtagErs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Github className="h-8 w-8" /></a>
          <a href="https://www.linkedin.com/in/artagers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="h-8 w-8" /></a>
        </div>
      </div>
    </section>
  );
};