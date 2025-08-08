import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 md:px-8 lg:px-16 bg-card">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">My Work</h2>
        <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-12">
          Here are some of the projects I'm proud to have worked on. Each one was a unique challenge and a learning experience.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};