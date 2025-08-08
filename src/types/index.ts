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