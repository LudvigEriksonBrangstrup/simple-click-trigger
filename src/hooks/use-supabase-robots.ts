
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/types/content';

export function useSupabaseRobots() {
  const [robots, setRobots] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRobots() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('urdf')
          .select('id, name, image_uri, type, summary, urdf_uri, tags, maker')
          .order('name');
          
        if (error) {
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
            categories: robot.tags || ['trending'], // Use the tags from the database as categories
            urdfPath: robot.urdf_uri || '',
          }));
          
          setRobots(mappedRobots);
          console.log('Fetched robots from Supabase:', mappedRobots);
        }
      } catch (err) {
        console.error('Error fetching robots:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch robots');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRobots();
  }, []);
  
  return { robots, isLoading, error };
}
