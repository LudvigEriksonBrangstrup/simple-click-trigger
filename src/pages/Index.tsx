
import React from 'react';
import Layout from '@/components/layout/Layout';

// This is needed to make TypeScript recognize webkitdirectory as a valid attribute
declare module 'react' {
  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const Index: React.FC = () => {
  return <Layout />;
};

export default Index;
