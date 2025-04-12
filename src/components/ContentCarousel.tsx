
import React from 'react';
import Carousel from './Carousel';
import { Category } from '../types/content';
import { useSupabaseRobots } from '@/hooks/use-supabase-robots';

interface ContentCarouselProps {
  category: Category;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ category }) => {
  // Use the Supabase robots hook to fetch data
  const { robots, isLoading } = useSupabaseRobots();

  // Filter robots by the requested category
  const filteredItems = robots.filter(robot => 
    robot.categories.includes(category.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-pulse text-white">Loading robots data...</div>
      </div>
    );
  }

  return filteredItems.length > 0 ? (
    <div className="relative w-full">
      <Carousel 
        title={category.name} 
        items={filteredItems}
        showArchiveButton={false}
      />
    </div>
  ) : null;
};

export default ContentCarousel;
