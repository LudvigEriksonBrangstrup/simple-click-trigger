
import React, { useRef, useState, useEffect } from 'react';
import { ContentItem } from '../types/content';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMyList } from '@/hooks/use-my-list';

interface CarouselProps {
  title: string;
  items: ContentItem[];
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  title,
  items,
  className
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { myList, addToMyList, removeFromMyList, isInMyList } = useMyList();

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth / 4.1;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth / 4.1;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleItemClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handleStarClick = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation(); // Prevent navigation on star click
    
    if (isInMyList(item.id)) {
      removeFromMyList(item.id);
    } else {
      addToMyList(item);
    }
  };

  // If no items, don't render the carousel
  if (items.length === 0) return null;
  
  return <div className={cn("my-5", className)}>
          <div className="relative group">
            <div ref={carouselRef} className="carousel-container flex items-center gap-2 overflow-x-auto py-2 px-4 scroll-smooth">
              {items.map(item => <div key={item.id} className="carousel-item flex-shrink-0 cursor-pointer relative hover:z-10" style={{
              width: 'calc(100% / 4.1)'
              }} onClick={() => handleItemClick(item.id)}>
                  <div className="relative rounded-md w-full h-full group/item">
                    {/* Image container with darker overlay on hover */}
                    <div className="rounded-md overflow-hidden w-full h-full bg-black">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover/item:brightness-90" 
                        style={{
                          aspectRatio: '0.8',
                        }} 
                      />
                    </div>
                    {/* Star button */}
                    <div className="absolute top-4 right-4 p-2 z-20 invisible group-hover/item:visible" onClick={e => handleStarClick(e, item)}>
                      <Star size={24} className={cn("transition-colors duration-300", isInMyList(item.id) ? "fill-yellow-400 text-yellow-400" : "text-white hover:text-yellow-400")} />
                    </div>
                    {/* Title overlay - visible on hover without gradient */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <h3 className="text-gray-400 text-6xl font-bold drop-shadow-xl">{item.title}</h3>
                    </div>
                  </div>
                </div>)}
            </div>
            
            {/* Scroll buttons - changed to always visible */}
            <button onClick={handleScrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-full z-40" aria-label="Scroll left">
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-full z-40"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
  
};

export default Carousel;
