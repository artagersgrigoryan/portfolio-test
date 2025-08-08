import { useParams, Link } from "react-router-dom";
import { projects, ProjectContentBlock } from "@/data/projects";
import NotFound from "./NotFound";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const ProjectContent = ({ block }: { block: ProjectContentBlock }) => {
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
  const project = projects.find((p) => p.slug === slug);

  if (!project || !project.detail) {
    return <NotFound />;
  }

  const { title, detail } = project;
  const { heroImage, subtitle, overview, role, tools, content } = detail;

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
            <Link to="/projects" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
            </Link>
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
            {content.map((block, index) => (
              <ProjectContent key={index} block={block} />
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetailPage;