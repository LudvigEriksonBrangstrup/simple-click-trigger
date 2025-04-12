
import React, { useEffect, useRef } from 'react';

interface SplineViewerProps {
  splineUrl: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ splineUrl, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the spline-viewer script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    script.type = 'module';
    document.head.appendChild(script);

    // Clean up on unmount
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Create and append the spline-viewer element
      const splineViewer = document.createElement('spline-viewer');
      splineViewer.setAttribute('url', splineUrl);
      splineViewer.style.width = '100%';
      splineViewer.style.height = '100%';
      containerRef.current.appendChild(splineViewer);
    }
  }, [splineUrl, containerRef]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      {/* spline-viewer will be dynamically inserted here */}
    </div>
  );
};

export default SplineViewer;
