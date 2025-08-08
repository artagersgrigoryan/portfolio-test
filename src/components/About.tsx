import { Award, Lightbulb, Users } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-gray-300 mb-4">
            Hello! I'm Jane, a designer who loves to solve complex problems with clean, elegant solutions. With over 5 years of experience in the field, I've had the privilege of working on a diverse range of projects for clients across various industries.
          </p>
          <p className="text-gray-300">
            My design philosophy is rooted in empathy. I believe that understanding the user's needs and motivations is the key to creating products that are not only beautiful but also truly useful and enjoyable. I'm proficient in the entire design process, from user research and wireframing to high-fidelity prototyping and user testing.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">User-Centered Approach</h3>
              <p className="text-gray-400">Every design decision is driven by user research and feedback to ensure the final product is intuitive and effective.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Creative Problem Solving</h3>
              <p className="text-gray-400">I thrive on tackling challenging problems and finding innovative solutions that balance user needs and business goals.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Commitment to Quality</h3>
              <p className="text-gray-400">I am meticulous about details and committed to delivering pixel-perfect designs and polished user experiences.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};