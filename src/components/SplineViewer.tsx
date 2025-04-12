
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
        try {
          console.log('Enter key pressed, attempting to trigger animation');
          
          // Access the Spline app instance
          const app = splineRef.current;
          
          // Simple event broadcast - this is the safest approach
          // as it doesn't depend on specific API methods that might not exist
          if (app) {
            // Try multiple approaches to trigger animations
            
            // Method 1: Try to emit a general event
            try {
              if (typeof app.emitEvent === 'function') {
                app.emitEvent('keyDown', { key: 'Enter' });
                console.log('Emitted keyDown event to Spline scene');
              }
            } catch (e) {
              console.log('Method 1 failed:', e);
            }
            
            // Method 2: Try to trigger a specific event on the scene
            try {
              if (app.triggerEvent) {
                app.triggerEvent('keypress', { key: 'Enter' });
                console.log('Triggered keypress event on scene');
              }
            } catch (e) {
              console.log('Method 2 failed:', e);
            }
            
            // Method 3: Try accessing the runtime directly if available
            try {
              if (app.runtime && app.runtime.trigger) {
                app.runtime.trigger('keydown', { key: 'Enter' });
                console.log('Triggered keydown event via runtime');
              }
            } catch (e) {
              console.log('Method 3 failed:', e);
            }
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
    // Store reference to the Spline app instance
    splineRef.current = splineApp;
    console.log('Spline scene loaded successfully');
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
