import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  title_ar?: string | null;
  description: string;
  description_ar?: string | null;
  tech: string[];
  icon: string;
  color: string;
  glow_class: string;
  live_demo_url?: string;
  github_url?: string;
  detailed_description?: string | null;
  detailed_description_ar?: string | null;
  images?: string[] | null;
  advantages?: string[] | null;
  disadvantages?: string[] | null;
  features?: string[] | null;
  technologies_used?: string[] | null;
  created_at: string;
}

export const ProjectsList = ({ onEdit }: { onEdit: (project: Project) => void }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        toast({
          title: 'Error',
          description: `Failed to delete project: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: 'Success!',
        description: 'Project deleted successfully.',
      });
      
      // Trigger a page refresh to update the main site
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project.',
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

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No projects found. Create your first project above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{project.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tech.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Icon: {project.icon}</div>
                  <div className="text-muted-foreground">{project.glow_class}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {project.live_demo_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(project.live_demo_url, '_blank')}
                    >
                      <ExternalLink size={14} />
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(project.github_url, '_blank')}
                    >
                      <Github size={14} />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
                    <Edit size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteProject(project.id)}
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