
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineViewerProps {
  splineUrl: string;
  className?: string;
  scale?: number; // Added scale prop
}

const SplineViewer: React.FC<SplineViewerProps> = ({ 
  splineUrl, 
  className = '',
  scale = 1 // Default scale is 1
}) => {
  const splineRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    console.error('Error loading Spline scene:', error);
    setHasError(true);
    setIsLoading(false);
  };

  // Apply transform scale based on the scale prop
  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    // Add pointer-events: none to allow scrolling through the component
    pointerEvents: 'none' as const
  };

  return (
    <div className={`w-full ${className}`} style={containerStyle}>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center text-white opacity-60">
          Loading 3D model...
        </div>
      )}
      
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center text-white bg-red-900/20 rounded-lg p-4">
          Failed to load 3D model. Please try again later.
        </div>
      ) : (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
          <Spline scene={splineUrl} onLoad={onLoad} onError={handleError} />
        </Suspense>
      )}
    </div>
  );
};

export default SplineViewer;
