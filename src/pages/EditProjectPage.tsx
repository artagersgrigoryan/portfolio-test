import { useFieldArray, useForm } from "react-hook-form";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

const textBlockSchema = z.object({
  type: z.literal('text'),
  heading: z.string().min(1, "Heading is required."),
  body: z.string().min(1, "Body text is required."),
});

const imageBlockSchema = z.object({
  type: z.literal('image'),
  src: z.string().url("Please enter a valid image URL."),
  alt: z.string().optional(),
});

const videoBlockSchema = z.object({
    type: z.literal('video'),
    src: z.string().url("Please enter a valid video URL."),
    autoplay: z.boolean().default(true),
    loop: z.boolean().default(true),
    muted: z.boolean().default(true),
});

const twoColumnImageBlockSchema = z.object({
    type: z.literal('two-column-image'),
    src: z.string().url("Please enter a valid URL for the first image."),
    alt: z.string().optional(),
    src2: z.string().url("Please enter a valid URL for the second image."),
    alt2: z.string().optional(),
});

const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  twoColumnImageBlockSchema,
]);

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
  content: z.array(contentBlockSchema).optional(),
});

const EditProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      content: [],
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        showError("Failed to fetch project data.");
        console.error(error);
        navigate("/projects");
        return;
      }

      form.reset({
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image_url || "",
        liveUrl: data.live_url || "",
        tags: (data.tags || []).join(", "),
        heroImage: data.detail?.heroImage || "",
        subtitle: data.detail?.subtitle || "",
        overview: data.detail?.overview || "",
        role: data.detail?.role || "",
        tools: (data.detail?.tools || []).join(", "),
        content: data.detail?.content || [],
      });
      setIsLoading(false);
    };

    fetchProject();
  }, [slug, navigate, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content",
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!user) {
      showError("You must be logged in to edit a project.");
      return;
    }
    if (!slug) {
        showError("Project slug is missing.");
        return;
    }
    setIsSubmitting(true);

    const { imageUrl, liveUrl, tags, tools, heroImage, subtitle, overview, role, content, ...projectCore } = values;
    const tagsArray = tags.split(',').map(tag => tag.trim());
    const toolsArray = tools.split(',').map(tool => tool.trim());

    const { error } = await supabase
      .from("projects")
      .update({
        ...projectCore,
        user_id: user.id,
        tags: tagsArray,
        image_url: imageUrl,
        live_url: liveUrl,
        detail: {
          heroImage: heroImage,
          subtitle: subtitle,
          overview: overview,
          role: role,
          tools: toolsArray,
          content: content || [],
        },
      })
      .eq("slug", slug);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Project updated successfully!");
      navigate(`/project/${values.slug}`);
    }
    setIsSubmitting(false);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Edit Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Core Information</CardTitle>
                  <CardDescription>This information will be displayed on the project card.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Project Title</FormLabel><FormControl><Input placeholder="E-commerce Redesign" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="e-commerce-redesign" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea placeholder="A complete overhaul of a fashion e-commerce platform..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input placeholder="UX Research, UI Design" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Project Detail Page</CardTitle>
                  <CardDescription>This content will appear on the dedicated project page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="subtitle" render={({ field }) => (<FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input placeholder="Reimagining the online shopping experience..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="overview" render={({ field }) => (<FormItem><FormLabel>Project Overview</FormLabel><FormControl><Textarea placeholder="The goal of this project was to..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="role" render={({ field }) => (<FormItem><FormLabel>Your Role</FormLabel><FormControl><Input placeholder="Lead UX/UI Designer" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="tools" render={({ field }) => (<FormItem><FormLabel>Tools Used (comma-separated)</FormLabel><FormControl><Input placeholder="Figma, Adobe XD" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Project Content</CardTitle>
                  <CardDescription>Add content blocks that will make up the body of your project page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 pt-10 relative bg-background/50">
                      <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                      {field.type === 'text' && <div className="space-y-4"><FormField control={form.control} name={`content.${index}.heading`} render={({ field }) => (<FormItem><FormLabel>Heading</FormLabel><FormControl><Input placeholder="Section Heading" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`content.${index}.body`} render={({ field }) => (<FormItem><FormLabel>Body</FormLabel><FormControl><Textarea placeholder="Section body text..." {...field} /></FormControl><FormMessage /></FormItem>)} /></div>}
                      {field.type === 'image' && <div className="space-y-4"><FormField control={form.control} name={`content.${index}.src`} render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`content.${index}.alt`} render={({ field }) => (<FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input placeholder="Description of the image" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>}
                      {field.type === 'two-column-image' && <div className="space-y-4"><FormField control={form.control} name={`content.${index}.src`} render={({ field }) => (<FormItem><FormLabel>Left Image URL</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`content.${index}.alt`} render={({ field }) => (<FormItem><FormLabel>Left Image Alt Text</FormLabel><FormControl><Input placeholder="Description of the left image" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`content.${index}.src2`} render={({ field }) => (<FormItem><FormLabel>Right Image URL</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`content.${index}.alt2`} render={({ field }) => (<FormItem><FormLabel>Right Image Alt Text</FormLabel><FormControl><Input placeholder="Description of the right image" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>}
                      {field.type === 'video' && <div className="space-y-4"><FormField control={form.control} name={`content.${index}.src`} render={({ field }) => (<FormItem><FormLabel>Video URL</FormLabel><FormControl><Input placeholder="https://videos.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} /><div className="flex items-center space-x-4"><FormField control={form.control} name={`content.${index}.autoplay`} render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Autoplay</FormLabel></FormItem>)} /><FormField control={form.control} name={`content.${index}.loop`} render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Loop</FormLabel></FormItem>)} /><FormField control={form.control} name={`content.${index}.muted`} render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Muted</FormLabel></FormItem>)} /></div></div>}
                    </Card>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => append({ type: 'text', heading: '', body: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Text</Button>
                    <Button type="button" variant="outline" onClick={() => append({ type: 'image', src: '', alt: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Image</Button>
                    <Button type="button" variant="outline" onClick={() => append({ type: 'two-column-image', src: '', alt: '', src2: '', alt2: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add 2-Column Image</Button>
                    <Button type="button" variant="outline" onClick={() => append({ type: 'video', src: '', autoplay: true, loop: true, muted: true })}><PlusCircle className="mr-2 h-4 w-4" /> Add Video</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Assets & Links</CardTitle>
                  <CardDescription>URLs for images and the live project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Card Image URL</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="heroImage" render={({ field }) => (<FormItem><FormLabel>Hero Image URL</FormLabel><FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="liveUrl" render={({ field }) => (<FormItem><FormLabel>Live Project URL (Optional)</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                  <CardDescription>Review your changes and submit.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>) : ("Update Project")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProjectPage;