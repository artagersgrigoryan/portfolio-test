import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card>
      <CardHeader>
        <img
          src={project.image_url || '/placeholder.svg'}
          alt={project.title}
          className="rounded-lg object-cover w-full aspect-[16/9]"
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">{project.title}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
            <Button>View Live</Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;