import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  position_x: z.number().min(-200).max(200),
  position_y: z.number().min(-200).max(200),
});

type SkillFormData = z.infer<typeof skillSchema>;

const iconOptions = [
  'Code2', 'Database', 'Palette', 'Smartphone', 'Cloud', 
  'Lock', 'Zap', 'Brain', 'Settings', 'Globe', 'Shield', 'Rocket'
];

const colorOptions = [
  'text-primary', 'text-secondary', 'text-accent', 
  'text-blue-500', 'text-green-500', 'text-purple-500'
];

export const SkillForm = () => {
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      icon: 'Code2',
      color: 'text-primary',
      position_x: 0,
      position_y: 0,
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

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          name: data.name,
          icon: data.icon,
          color: data.color,
          position_x: data.position_x,
          position_y: data.position_y,
          tech: techStack,
        });

      if (error) {
        console.error('Error creating skill:', error);
        toast({
          title: 'Error',
          description: `Failed to create skill: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Skill created successfully.',
      });

      form.reset();
      setTechStack([]);
      
      // Trigger a page refresh to show new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error creating skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to create skill. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter skill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Technologies */}
        <div className="space-y-2">
          <FormLabel>Technologies</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
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
                <FormLabel>Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color.replace('text-', '')}
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
            name="position_x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position X (-200 to 200)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="-200" 
                    max="200" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position_y"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Y (-200 to 200)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="-200" 
                    max="200" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full glow-purple" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Skill'}
        </Button>
      </form>
    </Form>
  );
};