import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Database, Users, Mail, LogOut, Quote, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { SkillForm } from '@/components/admin/SkillForm';
import { ContactForm } from '@/components/admin/ContactForm';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { PersonalInfoForm } from '@/components/admin/PersonalInfoForm';
import { ProjectsList, Project } from '@/components/admin/ProjectsList';
import { SkillsList } from '@/components/admin/SkillsList';
import { TestimonialsList } from '@/components/admin/TestimonialsList';
import { AdminAuth } from '@/components/admin/AdminAuth';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass border-b border-glass-border p-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="font-orbitron text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                ADMIN PANEL
              </h1>
              <p className="font-inter text-muted-foreground mt-2">
                Manage your portfolio content and settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="glow-cyan"
                onClick={() => window.location.href = '/'}
              >
                View Site
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 glass">
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Database size={16} />
                Projects
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Settings size={16} />
                Skills
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <Quote size={16} />
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User size={16} />
                Personal
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail size={16} />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron">
                      <Plus size={20} className="text-primary" />
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </CardTitle>
                    <CardDescription>
                      Create a new project to showcase in your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectForm project={editingProject} onDone={() => setEditingProject(null)} />
                  </CardContent>
                </Card>

                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron">
                      <Database size={20} className="text-secondary" />
                      Project Statistics
                    </CardTitle>
                    <CardDescription>
                      Overview of your portfolio projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span className="font-inter text-sm text-muted-foreground">Total Projects</span>
                        <span className="font-orbitron font-bold text-primary">3</span>
                      </div>
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span className="font-inter text-sm text-muted-foreground">Published</span>
                        <span className="font-orbitron font-bold text-green-500">3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Manage Projects</CardTitle>
                  <CardDescription>
                    Edit or delete existing projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsList onEdit={(p) => { setEditingProject(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron">
                      <Plus size={20} className="text-primary" />
                      Add New Skill
                    </CardTitle>
                    <CardDescription>
                      Add a new skill to your expertise matrix
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkillForm />
                  </CardContent>
                </Card>

                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron">
                      <Settings size={20} className="text-secondary" />
                      Skill Matrix Overview
                    </CardTitle>
                    <CardDescription>
                      Your current skill distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span className="font-inter text-sm text-muted-foreground">Total Skills</span>
                        <span className="font-orbitron font-bold text-primary">8</span>
                      </div>
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span className="font-inter text-sm text-muted-foreground">Categories</span>
                        <span className="font-orbitron font-bold text-accent">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Manage Skills</CardTitle>
                  <CardDescription>
                    Edit or reposition your skills in the matrix
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron">
                      <Plus size={20} className="text-primary" />
                      Add New Testimonial
                    </CardTitle>
                    <CardDescription>
                      Add client testimonials and reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TestimonialForm />
                  </CardContent>
                </Card>

                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-orbitron">
                      <Quote size={20} className="text-secondary" />
                      Testimonials Overview
                    </CardTitle>
                    <CardDescription>
                      Manage your client testimonials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span className="font-inter text-sm text-muted-foreground">Total Testimonials</span>
                        <span className="font-orbitron font-bold text-primary">0</span>
                      </div>
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span className="font-inter text-sm text-muted-foreground">Average Rating</span>
                        <span className="font-orbitron font-bold text-yellow-500">5.0 ★</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Manage Testimonials</CardTitle>
                  <CardDescription>
                    View and manage all testimonials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialsList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="glass border-glass-border max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-orbitron">
                    <User size={20} className="text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile information, photo, and resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalInfoForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card className="glass border-glass-border max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-orbitron">
                    <Users size={20} className="text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Update your contact details and social media links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;