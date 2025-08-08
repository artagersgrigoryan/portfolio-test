import { ProjectCard, Project } from "./ProjectCard";

const projects: Project[] = [
  {
    title: "E-commerce Redesign",
    description: "A complete overhaul of a fashion e-commerce platform to improve user flow and conversion rates.",
    imageUrl: "https://images.unsplash.com/photo-1558522195-e17c1e79c938?q=80&w=2070&auto=format&fit=crop",
    tags: ["UX Research", "UI Design", "Prototyping"],
    liveUrl: "#",
  },
  {
    title: "SaaS Dashboard",
    description: "Designing an intuitive and data-rich dashboard for a B2B analytics software.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    tags: ["UI/UX Design", "Data Visualization", "Figma"],
    liveUrl: "#",
  },
  {
    title: "Mobile Banking App",
    description: "Creating a secure and user-friendly mobile banking application from scratch.",
    imageUrl: "https://images.unsplash.com/photo-1580974928064-f0ae6363a4ca?q=80&w=1935&auto=format&fit=crop",
    tags: ["Mobile App Design", "UX Strategy", "Wireframing"],
    liveUrl: "#",
  },
    {
    title: "Travel Booking Website",
    description: "A responsive website design for a travel agency, focusing on a seamless booking experience.",
    imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop",
    tags: ["Web Design", "Responsive Design", "User Testing"],
    liveUrl: "#",
  },
];

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