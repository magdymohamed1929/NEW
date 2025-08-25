import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Edit2, Trash2, Quote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  rating: number;
  image_url?: string;
  platform: string;
  created_at: string;
}

export const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        toast({
          title: "Error",
          description: "Failed to load testimonials: " + error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.log('No testimonials found');
        setTestimonials([]);
        return;
      }

      console.log('Fetched testimonials:', data);
      setTestimonials(data);
    } catch (error) {
      console.error('Exception while fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting testimonial:', error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Testimonial deleted successfully!",
      });

      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? "text-yellow-400 fill-current" : "text-muted-foreground"}
      />
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-4">
      {testimonials.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Quote size={48} className="mx-auto mb-4 opacity-50" />
          <p>No testimonials yet. Add your first testimonial above!</p>
        </div>
      ) : (
        testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="glass border-glass-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                    {testimonial.name}
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-inter">
                      {testimonial.platform}
                    </span>
                  </CardTitle>
                  {(testimonial.position || testimonial.company) && (
                    <p className="font-inter text-sm text-muted-foreground mt-1">
                      {testimonial.position}
                      {testimonial.position && testimonial.company && ' at '}
                      {testimonial.company}
                    </p>
                  )}
                  <div className="flex items-center space-x-1 mt-2">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-inter text-foreground/90 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
              {testimonial.image_url && (
                <div className="mt-3">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

/* CREATE POLICY "Anyone can view testimonials"
ON public.testimonials
FOR SELECT
USING (true); */