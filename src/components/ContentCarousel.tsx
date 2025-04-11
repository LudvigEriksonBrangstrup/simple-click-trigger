
import React from 'react';
import Carousel from './Carousel';
import { contentItems } from '../data/content';
import { Category } from '../types/content';

interface ContentCarouselProps {
  category: Category;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ category }) => {
  // Filter content items by the category
  const filteredItems = contentItems.filter(item => 
    item.categories.includes(category.id)
  );

  return filteredItems.length > 0 ? (
    <div className="relative w-full">
      <Carousel 
        title={category.name} 
        items={filteredItems} 
      />
    </div>
  ) : null;
};

export default ContentCarousel;
