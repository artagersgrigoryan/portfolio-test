import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Please enter a valid image URL."),
  liveUrl: z.string().url("Please enter a valid live URL.").optional().or(z.literal('')),
  tags: z.string().min(1, "Please enter at least one tag."),
  heroImage: z.string().url("Please enter a valid hero image URL."),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters."),
  overview: z.string().min(20, "Overview must be at least 20 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  tools: z.string().min(1, "Please enter at least one tool."),
});

const AddProjectPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      liveUrl: "",
      tags: "",
      heroImage: "",
      subtitle: "",
      overview: "",
      role: "",
      tools: "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!user) {
      showError("You must be logged in to add a project.");
      return;
    }

    const { tags, tools, heroImage, subtitle, overview, role, ...rest } = values;
    const tagsArray = tags.split(',').map(tag => tag.trim());
    const toolsArray = tools.split(',').map(tool => tool.trim());

    const { error } = await supabase.from("projects").insert([
      {
        ...rest,
        user_id: user.id,
        tags: tagsArray,
        image_url: values.imageUrl,
        live_url: values.liveUrl,
        detail: {
          heroImage: heroImage,
          subtitle: subtitle,
          overview: overview,
          role: role,
          tools: toolsArray,
          content: [], // For now, content will be empty. A more complex form is needed for this.
        },
      },
    ]);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Project added successfully!");
      navigate("/projects");
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Add New Project</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e-commerce-redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A complete overhaul of a fashion e-commerce platform..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Project URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="UX Research, UI Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h2 className="text-2xl font-bold text-white pt-4 border-t border-border">Project Detail Page Content</h2>
            <FormField
              control={form.control}
              name="heroImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Reimagining the online shopping experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Overview</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The goal of this project was to..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Lead UX/UI Designer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tools Used (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Figma, Adobe XD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Project</Button>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default AddProjectPage;