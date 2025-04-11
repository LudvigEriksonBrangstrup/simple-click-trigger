
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  FolderPlus, 
  Folder, 
  X
} from "lucide-react";
import { useProjects, Project } from "@/hooks/use-projects";
import { ContentItem } from "@/types/content";
import { useMyList } from "@/hooks/use-my-list";
import { useToast } from "@/hooks/use-toast";

interface ProjectSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: ContentItem;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  isOpen,
  onClose,
  contentItem
}) => {
  const { projects, addProject, addToProject, getItemProjects } = useProjects();
  const { addToMyList } = useMyList();
  const { toast } = useToast();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const itemProjects = getItemProjects(contentItem.id);

  const handleProjectSelect = (projectId: string) => {
    // Add to MyList if not already there
    addToMyList(contentItem);
    // Add to selected project
    addToProject(projectId, contentItem.id);
    toast({
      title: "Added to project",
      description: `${contentItem.title} was added to the project`,
    });
    onClose();
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const project = addProject(newProjectName, newProjectDesc);
    addToMyList(contentItem);
    addToProject(project.id, contentItem.id);
    
    toast({
      title: "Project created",
      description: `${contentItem.title} was added to ${newProjectName}`,
    });
    
    setNewProjectName("");
    setNewProjectDesc("");
    setIsCreatingProject(false);
    onClose();
  };

  const isInProject = (project: Project) => {
    return itemProjects.some(p => p.id === project.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Add to Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a project or create a new one
          </DialogDescription>
        </DialogHeader>

        {isCreatingProject ? (
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
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="w-full"
              >
                Create Project
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreatingProject(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto space-y-2 my-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No projects yet. Create your first project!
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                      isInProject(project)
                        ? "bg-blue-900/30 border border-blue-500/50"
                        : "hover:bg-gray-800/80 border border-gray-700"
                    }`}
                  >
                    <Folder className="mr-3 text-blue-400" size={20} />
                    <div className="flex-1">
                      <h3 className="font-medium">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-400">{project.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {project.items.length} item{project.items.length !== 1 && "s"}
                      </p>
                    </div>
                    {isInProject(project) && (
                      <CheckCircle2 className="text-blue-400" size={18} />
                    )}
                  </div>
                ))
              )}
            </div>

            <Button
              onClick={() => setIsCreatingProject(true)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FolderPlus size={16} />
              Create New Project
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelector;
