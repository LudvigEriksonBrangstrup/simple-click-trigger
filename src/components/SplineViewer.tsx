
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
    }
  };

  const triggerSplineEvent = (keyName: string) => {
    if (splineRef.current) {
      try {
        // Try to trigger an event in the Spline scene
        const keyboard = splineRef.current.findObjectByName('Keyboard');
        if (keyboard) {
          console.log('Found keyboard object, triggering event');
          keyboard.emitEvent('keyDown', { key: keyName });
        } else {
          console.log('Keyboard object not found in Spline scene');
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
