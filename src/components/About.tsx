import { Code, Lightbulb, Users } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What I Do</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                As a digital product designer and developer, I focus on creating seamless and engaging user experiences from concept to deployment. My work combines thoughtful design with clean, efficient code.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-primary/10 text-primary p-4 rounded-full">
              <Lightbulb className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Product Design</h3>
              <p className="text-gray-400">Crafting intuitive interfaces and user flows that solve real problems.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-primary/10 text-primary p-4 rounded-full">
              <Code className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Web Development</h3>
              <p className="text-gray-400">Building responsive, high-performance websites and applications.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-primary/10 text-primary p-4 rounded-full">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">User-Centric Approach</h3>
              <p className="text-gray-400">Putting the user at the heart of the design process to create products people love.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};