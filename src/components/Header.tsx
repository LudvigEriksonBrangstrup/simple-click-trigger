
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Home } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/90 backdrop-blur-md py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-white/5">
      <div className="flex items-center">
        <Link to="/" className="text-white font-bold text-3xl tracking-wider mr-8 hover:text-blue-400 transition-colors">
          QUALIA STUDIOS
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link to="/my-list" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Star size={16} />
            <span>Starred</span>
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
    </header>
  );
};

export default Header;
