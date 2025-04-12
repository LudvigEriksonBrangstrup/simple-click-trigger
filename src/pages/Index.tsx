
import React from 'react';
import Layout from '@/components/layout/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// This is needed to make TypeScript recognize webkitdirectory as a valid attribute
declare module 'react' {
  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

// Create a client
const queryClient = new QueryClient();

const Index: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
};

export default Index;
