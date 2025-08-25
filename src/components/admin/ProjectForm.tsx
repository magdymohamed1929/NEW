import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadToCloudinary } from '@/integrations/cloudinary/upload';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  title_ar: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  description_ar: z.string().optional(),
  detailed_description: z.string().optional(),
  detailed_description_ar: z.string().optional(),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color gradient is required'),
  glow_class: z.string().min(1, 'Glow class is required'),
  live_demo_url: z.string().optional(),
  github_url: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const iconOptions = [
  'Zap', 'Shield', 'Rocket', 'Code2', 'Database', 'Palette', 
  'Smartphone', 'Cloud', 'Lock', 'Brain', 'Star', 'Heart'
];

const colorOptions = [
  'from-primary to-secondary',
  'from-secondary to-accent', 
  'from-accent to-primary',
  'from-primary to-accent',
  'from-secondary to-primary'
];

const glowOptions = [
  'glow-cyan', 'glow-purple', 'glow-magenta', 'glow-blue', 'glow-green'
];

import type { Project } from '@/components/admin/ProjectsList';

export const ProjectForm = ({ project, onDone }: { project: Project | null; onDone?: () => void }) => {
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [advantages, setAdvantages] = useState<string[]>([]);
  const [newAdvantage, setNewAdvantage] = useState('');
  const [disadvantages, setDisadvantages] = useState<string[]>([]);
  const [newDisadvantage, setNewDisadvantage] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState<string[]>([]);
  const [newTechUsed, setNewTechUsed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      title_ar: (project as any)?.title_ar || '',
      description: project?.description || '',
      description_ar: (project as any)?.description_ar || '',
      detailed_description: project?.detailed_description || '',
      detailed_description_ar: (project as any)?.detailed_description_ar || '',
      icon: project?.icon || 'Zap',
      color: project?.color || 'from-primary to-secondary',
      glow_class: project?.glow_class || 'glow-cyan',
      live_demo_url: project?.live_demo_url || '',
      github_url: project?.github_url || '',
    },
  });

  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const { secureUrl } = await uploadToCloudinary(file, { folder: 'portfolio/projects' });
      setImages((prev) => [...prev, secureUrl]);
      toast({ title: 'Uploaded', description: 'Image uploaded successfully.' });
    } catch (err: any) {
      console.error('Upload failed:', err);
      toast({ title: 'Upload failed', description: err.message || 'Could not upload image', variant: 'destructive' });
    } finally {
      setIsUploadingImage(false);
      e.currentTarget.value = '';
    }
  };

  const removeImage = (image: string) => {
    setImages(images.filter(i => i !== image));
  };

  const addAdvantage = () => {
    if (newAdvantage.trim() && !advantages.includes(newAdvantage.trim())) {
      setAdvantages([...advantages, newAdvantage.trim()]);
      setNewAdvantage('');
    }
  };

  const removeAdvantage = (advantage: string) => {
    setAdvantages(advantages.filter(a => a !== advantage));
  };

  const addDisadvantage = () => {
    if (newDisadvantage.trim() && !disadvantages.includes(newDisadvantage.trim())) {
      setDisadvantages([...disadvantages, newDisadvantage.trim()]);
      setNewDisadvantage('');
    }
  };

  const removeDisadvantage = (disadvantage: string) => {
    setDisadvantages(disadvantages.filter(d => d !== disadvantage));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const addTechUsed = () => {
    if (newTechUsed.trim() && !technologiesUsed.includes(newTechUsed.trim())) {
      setTechnologiesUsed([...technologiesUsed, newTechUsed.trim()]);
      setNewTechUsed('');
    }
  };

  const removeTechUsed = (tech: string) => {
    setTechnologiesUsed(technologiesUsed.filter(t => t !== tech));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      let error: any = null;
      if (project?.id) {
        ({ error } = await supabase
          .from('projects')
          .update({
            title: data.title,
            title_ar: data.title_ar || null,
            description: data.description,
            description_ar: data.description_ar || null,
            detailed_description: data.detailed_description || null,
            detailed_description_ar: data.detailed_description_ar || null,
            tech: techStack,
            images: images,
            advantages: advantages,
            disadvantages: disadvantages,
            features: features,
            technologies_used: technologiesUsed,
            icon: data.icon,
            color: data.color,
            glow_class: data.glow_class,
            live_demo_url: data.live_demo_url || null,
            github_url: data.github_url || null,
          })
          .eq('id', project.id));
      } else {
        ({ error } = await supabase
          .from('projects')
          .insert({
            title: data.title,
            title_ar: data.title_ar || null,
            description: data.description,
            description_ar: data.description_ar || null,
            detailed_description: data.detailed_description || null,
            detailed_description_ar: data.detailed_description_ar || null,
            tech: techStack,
            images: images,
            advantages: advantages,
            disadvantages: disadvantages,
            features: features,
            technologies_used: technologiesUsed,
            icon: data.icon,
            color: data.color,
            glow_class: data.glow_class,
            live_demo_url: data.live_demo_url || null,
            github_url: data.github_url || null,
          }));
      }

      if (error) {
        console.error('Error creating project:', error);
        toast({
          title: 'Error',
          description: `Failed to create project: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success!',
        description: project?.id ? 'Project updated successfully.' : 'Project created successfully.',
      });

      form.reset();
      setTechStack([]);
      setImages([]);
      setAdvantages([]);
      setDisadvantages([]);
      setFeatures([]);
      setTechnologiesUsed([]);
      
      if (onDone) onDone();
      // Trigger a page refresh to show new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hydrate arrays when editing
  useEffect(() => {
    if (project) {
      setTechStack(project.tech || []);
      setImages(project.images || []);
      setAdvantages(project.advantages || []);
      setDisadvantages(project.disadvantages || []);
      setFeatures(project.features || []);
      setTechnologiesUsed(project.technologies_used || []);
    }
  }, [project]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المشروع (Arabic)</FormLabel>
              <FormControl>
                <Input dir="rtl" placeholder="أدخل عنوان المشروع" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف (Arabic)</FormLabel>
              <FormControl>
                <Textarea 
                  dir="rtl"
                  placeholder="اكتب وصف المشروع"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailed_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a detailed description for the project page" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailed_description_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف تفصيلي (Arabic)</FormLabel>
              <FormControl>
                <Textarea 
                  dir="rtl"
                  placeholder="أدخل وصفًا تفصيليًا لصفحة المشروع"
                  className="min-h+[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tech Stack */}
        <div className="space-y-2">
          <FormLabel>Tech Stack</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add technology"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
            />
            <Button type="button" onClick={addTech} size="sm" variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                {tech}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeTech(tech)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <FormLabel>Project Images (URLs)</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            />
            <Button type="button" onClick={addImage} size="sm" variant="outline">
              <Plus size={16} />
            </Button>
            <div>
              <input type="file" accept="image/*" onChange={handleSelectImage} disabled={isUploadingImage} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((image) => (
              <Badge key={image} variant="secondary" className="flex items-center gap-1 max-w-xs">
                <span className="truncate">{image}</span>
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeImage(image)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="space-y-2">
          <FormLabel>Advantages</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add advantage"
              value={newAdvantage}
              onChange={(e) => setNewAdvantage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAdvantage())}
            />
            <Button type="button" onClick={addAdvantage} size="sm" variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {advantages.map((advantage) => (
              <Badge key={advantage} variant="secondary" className="flex items-center gap-1">
                {advantage}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeAdvantage(advantage)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Disadvantages */}
        <div className="space-y-2">
          <FormLabel>Challenges/Disadvantages</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add challenge or disadvantage"
              value={newDisadvantage}
              onChange={(e) => setNewDisadvantage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDisadvantage())}
            />
            <Button type="button" onClick={addDisadvantage} size="sm" variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {disadvantages.map((disadvantage) => (
              <Badge key={disadvantage} variant="secondary" className="flex items-center gap-1">
                {disadvantage}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeDisadvantage(disadvantage)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <FormLabel>Key Features</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="sm" variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                {feature}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeFeature(feature)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Additional Technologies */}
        <div className="space-y-2">
          <FormLabel>Additional Technologies Used</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add additional technology"
              value={newTechUsed}
              onChange={(e) => setNewTechUsed(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechUsed())}
            />
            <Button type="button" onClick={addTechUsed} size="sm" variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologiesUsed.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                {tech}
                <X 
                  size={12} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => removeTechUsed(tech)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Gradient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gradient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color.split('-').slice(1).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="glow_class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Glow Effect</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select glow" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {glowOptions.map((glow) => (
                      <SelectItem key={glow} value={glow}>
                        {glow.replace('glow-', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="live_demo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username/repo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full glow-cyan" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
};