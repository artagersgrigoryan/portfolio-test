import { Badge } from "@/components/ui/badge";

const skills = {
  "Design": ["UI/UX Design", "Responsive Design", "Prototyping", "User Research", "Wireframing", "Design Systems", "Human-Centered Design"],
  "Development": ["HTML/CSS/Sass", "JavaScript (ES6+)", "TypeScript", "React/Redux", "Next.js", "Vue.js/Vuex", "Nuxt.js", "Node.js/Express", "REST APIs"],
  "Tools & Platforms": ["Figma", "Adobe XD", "Git/GitHub", "Webpack", "Babel", "Jira", "VS Code", "Supabase", "Vercel"]
};

export const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-screen-xl mx-auto px-10">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              I'm a self-taught digital product designer and developer based in Armenia. I am passionate about creating user-centered, delightful, and human experiences. I enjoy turning complex problems into simple, beautiful, and intuitive designs that are both functional and aesthetically pleasing.
            </p>
        </div>
        
        <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-8">My Skills</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="bg-card p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-primary mb-4">{category}</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {skillList.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};