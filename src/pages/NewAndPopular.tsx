
import React from 'react';
import Header from '@/components/Header';
import URDFViewer from '@/components/URDFViewer';
import SplineViewer from '@/components/SplineViewer';

const NewAndPopular: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      <Header />
      <div className="mt-16 p-4">
        <h1 className="text-4xl font-bold mb-4">New & Popular</h1>
        
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          {/* Title section */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4">Featured Model</h2>
            <p className="text-netflix-text2 mb-6">
              Explore our latest interactive 3D model. Click and drag to interact with it.
            </p>
          </div>
          
          {/* Spline Asset with large scale */}
          <div className="md:w-1/2 h-[350px] rounded-lg overflow-hidden mb-4">
            <SplineViewer 
              splineUrl="https://prod.spline.design/Ze6evzKLyY-Xq6uh/scene.splinecode" 
              scale={1.8} 
              enableInteraction={true}
            />
          </div>
        </div>
        
        <div className="h-[400px] rounded-lg overflow-hidden mt-8">
          {/* Pass hasAnimation prop without inputCustomUrdfPath */}
          <URDFViewer hasAnimation={true} />
        </div>
      </div>
    </div>
  );
};

export default NewAndPopular;
