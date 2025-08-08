export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  live_url: string | null;
};