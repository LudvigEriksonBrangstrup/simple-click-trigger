
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/types/content';

export function useQueryRobots(categoryId?: string) {
  return useQuery({
    queryKey: ['robots', categoryId],
    queryFn: async (): Promise<ContentItem[]> => {
      let query = supabase
        .from('urdf')
        .select('id, name, image_uri, type, summary, urdf_uri, tags, maker');
      
      // If category is provided, filter by that category/tag
      if (categoryId) {
        query = query.contains('tags', [categoryId]);
      }
      
      const { data, error } = await query.order('name');
          
      if (error) {
        console.error('Error fetching robots:', error);
        throw error;
      }
      
      if (data) {
        // Map Supabase data to our ContentItem format
        const mappedRobots = data.map(robot => {
          // Check if image_uri is a storage path or direct URL
          let imageUrl = '/placeholder.svg';
          
          if (robot.image_uri) {
            // If image_uri is already a complete URL, use it directly
            if (robot.image_uri.startsWith('http')) {
              imageUrl = robot.image_uri;
            } else {
              // If it's a storage path, construct the public URL using the correct bucket name
              const { data } = supabase.storage
                .from('robotspicturesbucket')  // Use the correct bucket name
                .getPublicUrl(robot.image_uri);
                
              if (data && data.publicUrl) {
                imageUrl = data.publicUrl;
              }
            }
          }
          
          return {
            id: robot.id,
            title: robot.name,
            imageUrl: imageUrl,
            description: robot.summary || `A ${robot.type || 'robot'} created by ${robot.maker || 'unknown maker'}.`,
            categories: robot.tags || ['trending'],
            urdfPath: robot.urdf_uri || '',
          };
        });
        
        console.log('Mapped robots with images:', mappedRobots);
        return mappedRobots;
      }
      
      return [];
    },
  });
}
