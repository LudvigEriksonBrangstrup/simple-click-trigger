
import React from 'react';
import Header from '../components/Header';

const Movies: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>
        <p className="text-xl">Browse all movies</p>
      </main>
    </div>
  );
};

export default Movies;
