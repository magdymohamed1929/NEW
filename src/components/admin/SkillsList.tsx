import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  position_x: number;
  position_y: number;
  tech: string[];
  created_at: string;
}

export const SkillsList = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load skills.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting skill:', error);
        toast({
          title: 'Error',
          description: `Failed to delete skill: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      setSkills(skills.filter(s => s.id !== id));
      toast({
        title: 'Success!',
        description: 'Skill deleted successfully.',
      });
      
      // Trigger a page refresh to update the main site
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete skill.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No skills found. Create your first skill above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell>
                <div className="font-medium">{skill.name}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {skill.tech.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {skill.tech.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{skill.tech.length - 4}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>X: {skill.position_x}</div>
                  <div>Y: {skill.position_y}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Icon: {skill.icon}</div>
                  <div className="text-muted-foreground">{skill.color}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteSkill(skill.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};