const experienceData = [
  {
    company: "Digitain",
    role: "Front-end Developer",
    period: "Jun 2022 - Present",
    description: "Developing and maintaining complex, high-performance user interfaces for sports betting and gaming platforms using modern web technologies."
  },
  {
    company: "VOLO LLC",
    role: "Front-end Developer",
    period: "Jan 2022 - May 2022",
    description: "Collaborated in an agile team to build and enhance client-side applications, focusing on code quality, performance, and user experience."
  },
  {
    company: "ROBOCODE LLC",
    role: "Front-end Developer",
    period: "Sep 2021 - Dec 2021",
    description: "Translated UI/UX design wireframes into actual code, producing visual elements of web applications and ensuring cross-browser compatibility."
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