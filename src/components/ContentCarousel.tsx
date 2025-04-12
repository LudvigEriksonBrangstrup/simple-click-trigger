
import React from 'react';
import Carousel from './Carousel';
import { Category } from '../types/content';
import { useQueryRobots } from '@/hooks/use-query-robots';

interface ContentCarouselProps {
  category: Category;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ category }) => {
  const { data: robots = [], isLoading, error } = useQueryRobots(category.id);

  if (isLoading) {
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading robots...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading robots:', error);
    return (
      <div className="relative w-full text-red-500">
        Failed to load robots. Please try again later.
      </div>
    );
  }

  return robots.length > 0 ? (
    <div className="relative w-full">
      <Carousel 
        title={category.name} 
        items={robots}
        showArchiveButton={false}
      />
    </div>
  ) : null;
};

export default ContentCarousel;
