
import React, { Suspense, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineViewerProps {
  splineUrl: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ splineUrl, className = '' }) => {
  const splineRef = useRef<any>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && splineRef.current) {
        // Try to trigger animation when Enter is pressed
        try {
          console.log('Enter key pressed, attempting to trigger animation');
          
          // Try different approaches to trigger the animation
          const app = splineRef.current;
          
          // Just broadcast an event to the entire scene
          // This is safer than trying to access specific objects or methods that might not exist
          if (app && typeof app.emitEvent === 'function') {
            app.emitEvent('keyDown', { key: 'Enter' });
            console.log('Emitted keyDown event to Spline scene');
          }
        } catch (error) {
          console.error('Error triggering Spline animation:', error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    console.log('Spline scene loaded');
    
    // Don't try to call methods that might not exist
    // Instead, save the reference and use it when needed
  };

  return (
    <div className={`w-full ${className}`}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
        <Spline scene={splineUrl} onLoad={onLoad} />
      </Suspense>
    </div>
  );
};

export default SplineViewer;
