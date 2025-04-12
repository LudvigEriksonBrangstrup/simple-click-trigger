
import React from "react";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import TeamSection from "../components/TeamSection";
import ChatWindow from "../components/ChatWindow";
import { useSupabaseRobots } from "@/hooks/use-supabase-robots";

const Explore: React.FC = () => {
  // Fetch robots from Supabase
  const { robots, isLoading } = useSupabaseRobots();

  // Group content items by categories from the tags
  const categorizedContent = robots.reduce((acc, item) => {
    item.categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    });
    return acc;
  }, {} as Record<string, typeof robots>);

  // Get unique categories
  const uniqueCategories = Object.keys(categorizedContent).sort();

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      <Header />

      {/* Cosmic background wrapper */}
      <div className="cosmic-background fixed inset-0 z-0">
        {/* Cosmic background with stars */}
        <div className="absolute inset-0 bg-[#0a0a14] overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwMCIgaGVpZ2h0PSIyMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuNyIgbnVtT2N0YXZlcz0iMTAiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48ZmVCbGVuZCBtb2RlPSJzY3JlZW4iLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9Ii4xIi8+PC9zdmc+')] bg-repeat opacity-30"></div>
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-black/30"></div>
          {/* Random stars */}
          <div className="stars absolute inset-0"></div>
        </div>
      </div>

      <div className="pt-24 relative z-10">
        {/* Main content area */}
        <main className="container mx-auto px-4 pb-8 max-w-full">
          {/* Page title */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white animate-fade-in">
              Explore All Robots
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our complete collection of robotics systems and deployable URDF units
            </p>
          </div>

          {/* Chat window right below the title */}
          <section className="mb-12 max-w-4xl mx-auto">
            <div className="glass-panel">
              <ChatWindow />
            </div>
          </section>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-white">Loading robots data...</div>
            </div>
          ) : (
            /* Content sections */
            <div className="relative z-10">
              <div className="space-y-20">
                {uniqueCategories.map(category => (
                  <section key={category} className="category-section min-h-[20vh]">
                    <h2 className="text-3xl font-bold mb-8 text-netflix-text text-glow capitalize">
                      {category}
                    </h2>
                    <Carousel 
                      title={category} 
                      items={categorizedContent[category]} 
                      className="glass-panel p-6 rounded-xl" 
                    />
                  </section>
                ))}
              </div>
            </div>
          )}

          {/* Team Section */}
          <div className="mt-20">
            <TeamSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
