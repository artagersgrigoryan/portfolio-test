import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link to={`/project/${project.slug}`} className="block group">
      <Card className="overflow-hidden border-border hover:border-primary transition-all duration-300 h-full bg-card flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="text-2xl font-bold text-white mb-2">{project.title}</CardTitle>
          <p className="text-gray-300 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        {project.liveUrl && (
          <CardFooter className="p-6 pt-0">
            <div
              onClick={(e) => {
                e.preventDefault();
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              }}
              className="text-primary hover:underline flex items-center font-semibold cursor-pointer z-10 relative"
            >
              View Live Project <ExternalLink className="ml-2 h-4 w-4" />
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};