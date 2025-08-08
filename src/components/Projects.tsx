import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          slug,
          title,
          description,
          imageUrl:image_url,
          tags,
          liveUrl:live_url
        `);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        // The data from supabase needs to be mapped to the Project interface
        const formattedData = data.map(p => ({
            ...p,
            detail: { // detail is not fetched here, but the type requires it
                heroImage: '',
                subtitle: '',
                overview: '',
                role: '',
                tools: [],
                content: []
            }
        })) as Project[];
        setProjects(formattedData);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 px-4 md:px-8 lg:px-16 bg-card">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">My Work</h2>
        <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-12">
          Here are some of the projects I'm proud to have worked on. Each one was a unique challenge and a learning experience.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {loading ? (
            <>
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[400px] w-full" />
            </>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};