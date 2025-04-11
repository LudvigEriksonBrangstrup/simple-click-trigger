
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentItems } from '../data/content';
import { ContentItem } from '../types/content';
import Header from '../components/Header';

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (id) {
      const foundContent = contentItems.find(item => item.id === id);
      if (foundContent) {
        setContent(foundContent);
      } else {
        // Content not found, redirect to home
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!content) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Header />
      
      <main className="pb-12">
        {/* Hero banner */}
        <div className="relative h-[70vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-transparent to-transparent z-10"></div>
          <img 
            src={content.imageUrl.replace('300x200', '1920x1080')} 
            alt={content.title}
            
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-2/3">
            <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
            <div className="flex space-x-4 mb-6">
              <button className="bg-white text-black py-2 px-8 rounded flex items-center hover:bg-opacity-80 transition">
                Play
              </button>
              <button className="bg-gray-500/60 text-white py-2 px-6 rounded flex items-center hover:bg-gray-600/60 transition">
                Starred
              </button>
            </div>
            
            <p className="text-lg">{content.description}</p>
          </div>
        </div>
        
        {/* Content details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About {content.title}</h2>
              <p className="text-gray-300 mb-6">
                {content.description || "No description available."}
              </p>
              
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Categories: </span>
                  {content.categories.map((cat) => (
                    <span key={cat} className="text-white mr-2">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-netflix-hover rounded">
                <h3 className="text-xl font-medium mb-2">More Like This</h3>
                <div className="space-y-2">
                  {contentItems
                    .filter(item => 
                      item.id !== content.id && 
                      item.categories.some(cat => content.categories.includes(cat))
                    )
                    .slice(0, 3)
                    .map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded cursor-pointer"
                        onClick={() => navigate(`/content/${item.id}`)}
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-16 h-10 object-cover rounded"
                        />
                        <span>{item.title}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentDetail;
