
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Archive, Home, Compass, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useProjects } from '../hooks/use-projects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { projects } = useProjects();

  return <header className="backdrop-blur-md py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-white/5 bg-zinc-950">
      <div className="flex items-center">
        <Link to="/" className="flex items-center mr-8 group">
          <div className="w-10 h-10 overflow-hidden">
            <img src="/lovable-uploads/166630d9-f089-4678-a27c-7a00882f5ed0.png" alt="Spiral Logo" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
          </div>
          <span className="ml-2 text-white font-bold text-xl tracking-wider group-hover:text-blue-400 transition-colors">QUALIA</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link to="/explore" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Compass size={16} />
            <span>Explore</span>
          </Link>
          <Link to="/my-list" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Archive size={16} />
            <span>Projects</span>
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md transition-transform hover:scale-110 cursor-pointer flex items-center justify-center">
              <Avatar className="w-full h-full">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-transparent text-white">
                  <User size={18} />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-white">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Victor</p>
                <p className="text-xs leading-none text-zinc-400">Victor@loveslogin.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
            
            {projects.length > 0 ? (
              <>
                {projects.slice(0, 3).map(project => (
                  <DropdownMenuItem key={project.id} className="cursor-pointer hover:bg-zinc-800" asChild>
                    <Link to={`/my-list?project=${project.id}`} className="w-full">
                      <span className="truncate">{project.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                {projects.length > 3 && (
                  <DropdownMenuItem className="text-xs text-zinc-400 hover:bg-zinc-800" asChild>
                    <Link to="/my-list">View all projects</Link>
                  </DropdownMenuItem>
                )}
              </>
            ) : (
              <DropdownMenuItem className="text-zinc-400 cursor-default">
                No projects yet
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800" asChild>
              <Link to="/my-list">
                Manage Projects
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
};

export default Header;
