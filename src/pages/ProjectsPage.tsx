import { Header } from "@/components/Header";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";

const ProjectsPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;