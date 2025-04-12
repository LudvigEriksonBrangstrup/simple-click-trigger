
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
          const mappedRobots = data.map(robot => {
            let imageUrl = '/placeholder.svg';
            
            if (robot.image_uri) {
              // If image_uri is already a complete URL, use it directly
              if (robot.image_uri.startsWith('http')) {
                imageUrl = robot.image_uri;
              } else {
                // If it's a storage path, construct the public URL using the correct bucket name
                const { data } = supabase.storage
                  .from('robotspicturesbucket')  // Using the exact bucket name 'robotspicturesbucket'
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
