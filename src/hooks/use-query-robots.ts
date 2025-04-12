
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
        const mappedRobots = data.map(robot => ({
          id: robot.id,
          title: robot.name,
          // Use image_uri from Supabase or fall back to placeholder
          imageUrl: robot.image_uri || '/placeholder.svg',
          description: robot.summary || `A ${robot.type || 'robot'} created by ${robot.maker || 'unknown maker'}.`,
          categories: robot.tags || ['trending'],
          urdfPath: robot.urdf_uri || '',
        }));
        
        return mappedRobots;
      }
      
      return [];
    },
  });
}
