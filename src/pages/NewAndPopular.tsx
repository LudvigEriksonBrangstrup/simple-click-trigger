
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
        
        {/* Add Spline Asset with large scale */}
        <div className="h-[400px] rounded-lg overflow-hidden mb-8">
          <SplineViewer 
            splineUrl="https://prod.spline.design/Ze6evzKLyY-Xq6uh/scene.splinecode" 
            scale={1.8} 
          />
        </div>
        
        <div className="h-[600px] rounded-lg overflow-hidden">
          {/* Pass hasAnimation prop without inputCustomUrdfPath */}
          <URDFViewer hasAnimation={true} />
        </div>
      </div>
    </div>
  );
};

export default NewAndPopular;
