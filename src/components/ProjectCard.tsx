import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Project } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/edit-project/${project.slug}`);
  };

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
        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-primary hover:underline flex items-center font-semibold z-10"
            >
              View Live Project <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : <div />}
          {user && (
            <Button variant="secondary" size="sm" onClick={handleEditClick}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};