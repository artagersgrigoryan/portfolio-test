export interface ProjectContentBlock {
  type: 'image' | 'video' | 'text' | 'two-column-image';
  src?: string;
  src2?: string;
  alt?: string;
  alt2?: string;
  heading?: string;
  body?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  detail: {
    heroImage: string;
    subtitle: string;
    overview: string;
    role: string;
    tools: string[];
    content: ProjectContentBlock[];
  };
}

export const projects: Project[] = [
  {
    slug: "e-commerce-redesign",
    title: "E-commerce Redesign",
    description: "A complete overhaul of a fashion e-commerce platform to improve user flow and conversion rates.",
    imageUrl: "https://images.unsplash.com/photo-1558522195-e17c1e79c938?q=80&w=2070&auto=format&fit=crop",
    tags: ["UX Research", "UI Design", "Prototyping"],
    liveUrl: "#",
    detail: {
      heroImage: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop",
      subtitle: "Reimagining the online shopping experience for a modern fashion brand.",
      overview: "The goal of this project was to redesign an outdated e-commerce website to create a more engaging, intuitive, and seamless shopping experience. We focused on simplifying the navigation, improving product discovery, and streamlining the checkout process. The result is a visually appealing and highly functional platform that has led to a significant increase in user engagement and sales.",
      role: "Lead UX/UI Designer",
      tools: ["Figma", "Adobe XD", "UserTesting.com", "Hotjar"],
      content: [
        {
          type: 'text',
          heading: 'The Challenge',
          body: 'The previous website suffered from a cluttered interface, confusing navigation, and a lengthy checkout process. User feedback indicated frustration and high cart abandonment rates. The challenge was to address these issues while creating a design that reflected the brand\'s modern and sophisticated identity.'
        },
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
          alt: 'Fashion shopping concept'
        },
        {
          type: 'text',
          heading: 'Our Process',
          body: 'We began with extensive user research, including surveys, interviews, and analysis of user behavior on the old site. This led to the creation of user personas and journey maps, which informed our wireframes and prototypes. We conducted several rounds of usability testing to refine the design before moving to high-fidelity mockups and final implementation.'
        },
        {
          type: 'video',
          src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-fashion-photoshoot-5125-large.mp4',
          alt: 'Fashion video',
          autoplay: true,
          loop: true,
          muted: true,
        },
        {
            type: 'two-column-image',
            src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ab?q=80&w=2070&auto=format&fit=crop',
            alt: 'Red shoe',
            src2: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
            alt2: 'Colorful sneakers'
        },
        {
          type: 'text',
          heading: 'The Outcome',
          body: 'The redesigned website launched to positive reviews from both stakeholders and customers. Key metrics showed a 40% decrease in cart abandonment, a 25% increase in average session duration, and a 15% uplift in conversion rates within the first three months.'
        },
        {
          type: 'image',
          src: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?q=80&w=1964&auto=format&fit=crop',
          alt: 'Final product page design'
        }
      ]
    }
  },
  {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    description: "Designing an intuitive and data-rich dashboard for a B2B analytics software.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    tags: ["UI/UX Design", "Data Visualization", "Figma"],
    liveUrl: "#",
    detail: { heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", subtitle: "An intuitive dashboard for B2B analytics.", overview: "This project is not yet detailed.", role: "UI/UX Designer", tools: ["Figma"], content: [] }
  },
  {
    slug: "mobile-banking-app",
    title: "Mobile Banking App",
    description: "Creating a secure and user-friendly mobile banking application from scratch.",
    imageUrl: "https://images.unsplash.com/photo-1580974928064-f0ae6363a4ca?q=80&w=1935&auto=format&fit=crop",
    tags: ["Mobile App Design", "UX Strategy", "Wireframing"],
    liveUrl: "#",
    detail: { heroImage: "https://images.unsplash.com/photo-1580974928064-f0ae6363a4ca?q=80&w=1935&auto=format&fit=crop", subtitle: "A secure and user-friendly mobile banking app.", overview: "This project is not yet detailed.", role: "Lead Designer", tools: ["Sketch", "InVision"], content: [] }
  },
  {
    slug: "travel-booking-website",
    title: "Travel Booking Website",
    description: "A responsive website design for a travel agency, focusing on a seamless booking experience.",
    imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop",
    tags: ["Web Design", "Responsive Design", "User Testing"],
    liveUrl: "#",
    detail: { heroImage: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop", subtitle: "A seamless booking experience for a travel agency.", overview: "This project is not yet detailed.", role: "Web Designer", tools: ["Figma", "Webflow"], content: [] }
  },
];