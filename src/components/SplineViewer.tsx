
import React, { Suspense, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineViewerProps {
  splineUrl: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ splineUrl, className = '' }) => {
  const splineRef = useRef<any>(null);

  const onLoad = (splineApp: any) => {
    if (splineApp) {
      splineRef.current = splineApp;
      console.log('Spline scene loaded successfully');
      
      // Log all objects in the scene to help debug
      const allObjects = splineApp.findAllObjectsByType('SplineObject');
      console.log('All objects in Spline scene:', allObjects);
    }
  };

  const triggerSplineEvent = (keyName: string) => {
    if (splineRef.current) {
      try {
        // Try multiple potential object names that might exist in the Spline scene
        const objectsToTry = [
          'Keyboard', 
          'keyboard', 
          'Enter', 
          'enter', 
          'Button', 
          'button',
          'Text',
          'text',
          'Model',
          'model',
          'Scene',
          'scene'
        ];
        
        let triggered = false;
        
        // Try to find any of these objects
        for (const objName of objectsToTry) {
          const obj = splineRef.current.findObjectByName(objName);
          if (obj) {
            console.log(`Found object: ${objName}, attempting to trigger event`);
            
            // Try different event types
            const eventTypes = ['keyDown', 'keydown', 'click', 'trigger', 'activate', 'play'];
            
            for (const eventType of eventTypes) {
              try {
                console.log(`Attempting to emit ${eventType} event on ${objName}`);
                obj.emitEvent(eventType, { key: keyName });
                triggered = true;
              } catch (e) {
                console.log(`Event ${eventType} not supported on ${objName}`);
              }
            }
          }
        }
        
        if (!triggered) {
          // If no specific object was found, try broadcasting to the entire scene
          console.log('Attempting to broadcast event to entire scene');
          if (typeof splineRef.current.emitEvent === 'function') {
            splineRef.current.emitEvent('keyDown', { key: keyName });
          } else if (splineRef.current.addEventListener) {
            // For Spline runtime v2+
            const event = new KeyboardEvent('keydown', { key: keyName });
            splineRef.current.dispatchEvent(event);
          }
        }
      } catch (error) {
        console.error('Error triggering Spline event:', error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        console.log('Enter key pressed, triggering Spline event');
        triggerSplineEvent('Enter');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
        <Spline scene={splineUrl} onLoad={onLoad} />
      </Suspense>
    </div>
  );
};

export default SplineViewer;
