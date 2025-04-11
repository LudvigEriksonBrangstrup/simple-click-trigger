import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentItems } from '../data/content';
import Layout from '@/components/layout/Layout';
import Header from '../components/Header';

// This is needed to make TypeScript recognize webkitdirectory as a valid attribute
declare module 'react' {
  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the content item that matches the ID
  const content = id ? contentItems.find(item => item.id === id) : null;
  
  // If content not found, redirect to home
  if (!content) {
    // You could use a useEffect here for the navigation if preferred
    setTimeout(() => navigate('/'), 0);
    
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Header />
      {/* <Layout inputCustomUrdfPath={content.urdfPath} /> */}
      <Layout />
    </div>
  );
};

export default ContentDetail;