
import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineViewerProps {
  splineUrl: string;
  className?: string;
}

const SplineViewer: React.FC<SplineViewerProps> = ({ splineUrl, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
        <Spline scene={splineUrl} />
      </Suspense>
    </div>
  );
};

export default SplineViewer;
