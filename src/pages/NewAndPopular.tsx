
import React from 'react';
import Header from '@/components/Header';
import URDFViewer from '@/components/URDFViewer';
import SplineViewer from '@/components/SplineViewer';

const NewAndPopular: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      <Header />
      <div className="mt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">New & Popular</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[600px] rounded-lg overflow-hidden">
            {/* Pass hasAnimation prop without inputCustomUrdfPath */}
            <URDFViewer hasAnimation={true} />
          </div>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <SplineViewer 
              splineUrl="https://prod.spline.design/Ze6evzKLyY-Xq6uh/scene.splinecode" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAndPopular;
