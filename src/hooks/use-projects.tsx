
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ContentItem } from '../types/content';

export interface Project {
  id: string;
  name: string;
  description?: string;
  items: string[]; // Array of content item IDs
  createdAt: number;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (name: string, description?: string) => Project;
  addToProject: (projectId: string, itemId: string) => void;
  removeFromProject: (projectId: string, itemId: string) => void;
  getProjectItems: (projectId: string) => ContentItem[];
  getItemProjects: (itemId: string) => Project[];
  deleteProject: (projectId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { myList } = useMyList();

  // Load saved projects from local storage
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
      }
    }
  }, []);

  // Save projects to local storage when changed
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (name: string, description?: string): Project => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      items: [],
      createdAt: Date.now()
    };

    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const addToProject = (projectId: string, itemId: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          // Only add if not already in project
          if (!project.items.includes(itemId)) {
            return {
              ...project,
              items: [...project.items, itemId]
            };
          }
        }
        return project;
      })
    );
  };

  const removeFromProject = (projectId: string, itemId: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            items: project.items.filter(id => id !== itemId)
          };
        }
        return project;
      })
    );
  };

  const getProjectItems = (projectId: string): ContentItem[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    
    return project.items
      .map(itemId => myList.find(item => item.id === itemId))
      .filter((item): item is ContentItem => item !== undefined);
  };

  const getItemProjects = (itemId: string): Project[] => {
    return projects.filter(project => project.items.includes(itemId));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <ProjectsContext.Provider 
      value={{ 
        projects, 
        addProject, 
        addToProject, 
        removeFromProject,
        getProjectItems,
        getItemProjects,
        deleteProject
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

// Import MyList context to access content items
import { useMyList } from './use-my-list';

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
