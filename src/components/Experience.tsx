const experienceData = [
  {
    company: "Dyad",
    role: "Full-Stack Engineer",
    period: "Jan 2023 - Present",
    description: "Developing innovative web applications and contributing to a collaborative, fast-paced development environment."
  },
  {
    company: "Figma",
    role: "Designer & Developer Advocate (Contract)",
    period: "Jun 2022 - Dec 2022",
    description: "Bridged the gap between design and development communities, creating resources and advocating for best practices."
  },
  {
    company: "Vercel",
    role: "Freelance Developer",
    period: "Jan 2022 - May 2022",
    description: "Built and deployed high-performance websites for clients using Next.js and Vercel's platform."
  }
];

export const Experience = () => {
  return (
    <section id="experience" className="py-20 px-4 md:px-8 lg:px-16 bg-card">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Work Experience</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {experienceData.map((item, index) => (
            <div key={index} className="p-6 bg-background rounded-lg shadow-md">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold text-white">{item.role}</h3>
                <p className="text-sm text-gray-400">{item.period}</p>
              </div>
              <p className="text-lg text-primary font-semibold mb-2">{item.company}</p>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};