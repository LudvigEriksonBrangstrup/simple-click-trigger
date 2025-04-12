
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineViewerProps {
  splineUrl: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ splineUrl, className = '' }) => {
  const splineRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Reset error state when URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [splineUrl]);

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
    setIsLoading(false);
    setHasError(false);
    console.log('Spline scene loaded successfully');
  };

  const onError = (error: any) => {
    console.error('Error loading Spline scene:', error);
    
    // Try to retry loading a few times before giving up
    if (retryCount < maxRetries) {
      console.log(`Retrying Spline load (${retryCount + 1}/${maxRetries})...`);
      setRetryCount(prev => prev + 1);
      // Force remount of Spline component
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  // Fallback 3D placeholder when there's an error
  const ErrorFallback = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/30 to-black/50 rounded-lg p-8">
      <div className="text-white text-xl mb-4">
        3D model could not be loaded
      </div>
      <div className="text-white/70 text-sm text-center max-w-md">
        There was an issue loading the 3D scene. This could be due to network issues, 
        access restrictions, or the model may not be available.
      </div>
      <button 
        onClick={() => {
          setHasError(false);
          setIsLoading(true);
          setRetryCount(0);
        }}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Loading state
  const LoadingState = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/30 to-black/50">
      <div className="text-white text-xl">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mr-2 align-[-2px]"></div>
        Loading 3D model...
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {isLoading && <LoadingState />}
      
      {hasError ? (
        <ErrorFallback />
      ) : (
        <Suspense fallback={<LoadingState />}>
          {!isLoading && (
            <Spline 
              scene={splineUrl} 
              onLoad={onLoad} 
              onError={onError}
            />
          )}
        </Suspense>
      )}
    </div>
  );
};

export default SplineViewer;
