
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Archive, Home, Compass } from 'lucide-react';

const Header: React.FC = () => {
  return <header className="bg-black/90 backdrop-blur-md py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-white/5">
      <div className="flex items-center">
        <Link to="/" className="flex items-center mr-8 group">
          <div className="w-10 h-10 overflow-hidden">
            <img 
              src="/lovable-uploads/166630d9-f089-4678-a27c-7a00882f5ed0.png" 
              alt="Spiral Logo" 
              className="w-full h-full object-contain transition-transform group-hover:scale-110"
            />
          </div>
          <span className="ml-2 text-white font-bold text-xl tracking-wider group-hover:text-blue-400 transition-colors">SPATIAL AGENTS</span>
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
        <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Search size={18} />
          <span className="text-sm hidden sm:inline">Search</span>
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md transition-transform hover:scale-110 cursor-pointer"></div>
      </div>
    </header>;
};

export default Header;
