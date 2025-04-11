
import React, { useState } from 'react';
import Header from '../components/Header';
import { useMyList } from '../hooks/use-my-list';
import { useProjects, Project } from '../hooks/use-projects';
import { useNavigate } from 'react-router-dom';
import { Archive, FolderPlus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { ContentItem } from '../types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const MyList: React.FC = () => {
  const navigate = useNavigate();
  const { myList, removeFromMyList } = useMyList();
  const { projects, addProject, getProjectItems, deleteProject } = useProjects();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleItemClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    addProject(newProjectName, newProjectDesc);
    toast({
      title: "Project created",
      description: `Project "${newProjectName}" has been created`
    });
    
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      
      toast({
        title: "Project deleted",
        description: `Project "${projectToDelete.name}" has been deleted`
      });
      
      setProjectToDelete(null);
      setIsDeleteDialogOpen(false);
      if (selectedProjectId === projectToDelete.id) {
        setSelectedProjectId(null);
      }
    }
  };

  const projectItems = selectedProjectId 
    ? getProjectItems(selectedProjectId)
    : myList;

  // Selected project
  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Projects</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <FolderPlus size={16} />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Projects Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div 
              onClick={() => setSelectedProjectId(null)}
              className={`p-3 rounded-md cursor-pointer ${!selectedProjectId ? 'bg-blue-800/30 border border-blue-500/30' : 'hover:bg-gray-800/50 border border-gray-700'}`}
            >
              <h3 className="font-medium">All Items</h3>
              <p className="text-xs text-gray-400 mt-1">{myList.length} items</p>
            </div>

            {projects.map(project => (
              <div 
                key={project.id} 
                className={`p-3 rounded-md border ${selectedProjectId === project.id ? 'bg-blue-800/30 border-blue-500/30' : 'hover:bg-gray-800/50 border-gray-700'}`}
              >
                <div className="flex justify-between items-start">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <h3 className="font-medium">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-400">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {project.items.length} item{project.items.length !== 1 && 's'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                        onClick={() => {
                          setProjectToDelete(project);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={14} className="text-red-400" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedProject ? selectedProject.name : "All Archived Items"}
            </h2>
            
            {projectItems.length === 0 ? (
              <div className="text-center py-12 border border-gray-800 rounded-md bg-gray-900/30">
                <p className="text-xl mb-4">No items available</p>
                <p className="text-gray-400">
                  {selectedProject 
                    ? "Add items to this project by clicking the archive icon on content" 
                    : "Archive items by clicking the archive icon on content you want to save"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {projectItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="relative rounded-md overflow-hidden cursor-pointer group"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <h3 className="text-white text-xl p-4 font-medium">{item.title}</h3>
                    </div>
                    
                    {/* Remove from list button */}
                    <button 
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromMyList(item.id);
                      }}
                    >
                      <Archive size={20} className="fill-blue-400 text-blue-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div>
              <label htmlFor="project-name" className="text-sm font-medium mb-1 block">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="project-desc" className="text-sm font-medium mb-1 block">
                Description (optional)
              </label>
              <Input
                id="project-desc"
                placeholder="Enter description"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyList;
