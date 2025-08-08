import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;