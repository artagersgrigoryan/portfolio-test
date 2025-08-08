import { useParams, Link } from "react-router-dom";
import { Project, ProjectContentBlock } from "@/types";
import NotFound from "./NotFound";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const ProjectContent = ({ block }: { block: ProjectContentBlock }) => {
  // This component remains the same
  switch (block.type) {
    case 'text':
      return (
        <div className="max-w-3xl mx-auto my-12 md:my-16">
          <h3 className="text-3xl font-bold text-white mb-4">{block.heading}</h3>
          <p className="text-lg text-gray-300 leading-relaxed">{block.body}</p>
        </div>
      );
    case 'image':
      return (
        <div className="my-8 md:my-12">
          <img src={block.src} alt={block.alt || ''} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
      );
    case 'video':
      return (
        <div className="my-8 md:my-12">
          <video
            src={block.src}
            autoPlay={block.autoplay}
            loop={block.loop}
            muted={block.muted}
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      );
    case 'two-column-image':
        return (
            <div className="grid md:grid-cols-2 gap-8 my-8 md:my-12">
                <img src={block.src} alt={block.alt || ''} className="w-full h-auto rounded-lg shadow-lg" />
                <img src={block.src2} alt={block.alt2 || ''} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
        )
    default:
      return null;
  }
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          title,
          slug,
          detail
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        console.error("Error fetching project:", error);
        setNotFound(true);
      } else {
        // The data from supabase needs to be mapped to the Project interface
        const formattedData = {
            ...data,
            description: '', // Not needed on this page
            imageUrl: '', // Not needed on this page
            tags: [], // Not needed on this page
            liveUrl: '', // Not needed on this page
        } as Project;
        setProject(formattedData);
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (notFound) {
    return <NotFound />;
  }

  if (loading) {
    return (
        <div className="max-w-screen-xl mx-auto px-10 py-8 md:py-16">
            <Skeleton className="h-8 w-48 mb-16" />
            <header className="text-center mb-12 md:mb-16">
                <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-8 w-1/2 mx-auto" />
            </header>
            <Skeleton className="w-full h-96 rounded-xl shadow-2xl mb-12 md:mb-20" />
        </div>
    )
  }

  if (!project || !project.detail) {
    return <NotFound />;
  }

  const { title, detail } = project;
  const { heroImage, subtitle, overview, role, tools, content } = detail;

  return (
    <div className="max-w-screen-xl mx-auto px-10 py-8 md:py-16">
      <div className="mb-8 flex justify-between items-center">
          <Link to="/projects" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
          </Link>
          {user && (
            <Button asChild>
              <Link to={`/edit-project/${slug}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </Link>
            </Button>
          )}
      </div>

      <article>
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto">{subtitle}</p>
        </header>

        {heroImage && <div className="mb-12 md:mb-20">
          <img src={heroImage} alt={`${title} hero image`} className="w-full h-auto rounded-xl shadow-2xl" />
        </div>}

        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-20">
          <div className="md:col-span-8">
              <h2 className="text-3xl font-bold text-white mb-4">Project Overview</h2>
              <p className="text-lg text-gray-300 leading-relaxed">{overview}</p>
          </div>
          <aside className="md:col-span-4 space-y-6 bg-card p-6 rounded-lg h-fit">
              <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Role</h3>
                  <p className="text-lg text-white">{role}</p>
              </div>
              <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                      {tools.map(tool => <Badge key={tool} variant="secondary">{tool}</Badge>)}
                  </div>
              </div>
          </aside>
        </div>

        <div className="max-w-5xl mx-auto">
          {content && content.map((block, index) => (
            <ProjectContent key={index} block={block} />
          ))}
        </div>
      </article>
    </div>
  );
};

export default ProjectDetailPage;