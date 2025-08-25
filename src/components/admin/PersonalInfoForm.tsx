import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/integrations/cloudinary/upload';

const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  profile_image_url: z.string().url().optional().or(z.literal('')),
  resume_url: z.string().url().optional().or(z.literal(''))
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const PersonalInfoForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      profile_image_url: '',
      resume_url: ''
    }
  });

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('personal_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading personal info:', error);
        return;
      }

      if (data) {
        form.reset({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          profile_image_url: data.profile_image_url || '',
          resume_url: data.resume_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading personal info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('personal_info')
        .select('id')
        .single();

      const personalInfoData = {
        ...data,
        profile_image_url: data.profile_image_url || null,
        resume_url: data.resume_url || null
      };

      let error;

      if (existing) {
        // Update existing record
        ({ error } = await supabase
          .from('personal_info')
          .update(personalInfoData)
          .eq('id', existing.id));
      } else {
        // Insert new record
        ({ error } = await supabase
          .from('personal_info')
          .insert(personalInfoData));
      }

      if (error) {
        console.error('Error saving personal info:', error);
        toast({
          title: "Error",
          description: "Failed to save personal info. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Personal information saved successfully!",
      });

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error saving personal info:', error);
      toast({
        title: "Error",
        description: "Failed to save personal info. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Alex Nova" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Futuristic Developer & Digital Architect" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="profile_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/your-photo.jpg" {...field} />
              </FormControl>
              <FormMessage />
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setIsUploading(true);
                      const { secureUrl } = await uploadToCloudinary(file, { folder: 'portfolio/avatars' });
                      form.setValue('profile_image_url', secureUrl, { shouldValidate: true });
                      toast({ title: 'Uploaded', description: 'Profile image uploaded.' });
                    } catch (err: any) {
                      console.error('Upload failed:', err);
                      toast({ title: 'Upload failed', description: err.message || 'Could not upload image', variant: 'destructive' });
                    } finally {
                      setIsUploading(false);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume/CV URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/your-resume.pdf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio/About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief description about yourself..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full glow-cyan hover:glow-purple"
        >
          {isSubmitting ? 'Saving...' : 'Save Personal Information'}
        </Button>
      </form>
    </Form>
  );
};