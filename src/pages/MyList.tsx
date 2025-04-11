
import React from 'react';
import Header from '../components/Header';
import { useMyList } from '../hooks/use-my-list';
import { useNavigate } from 'react-router-dom';
import { Archive } from 'lucide-react';

const MyList: React.FC = () => {
  const { myList, removeFromMyList } = useMyList();
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Archived</h1>
        
        {myList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Your archive is empty</p>
            <p className="text-gray-400">Add items by clicking the archive icon on content you like</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myList.map((item) => (
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
      </main>
    </div>
  );
};

export default MyList;
