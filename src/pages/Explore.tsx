
import React from "react";
import { contentItems } from "../data/content";
import Header from "../components/Header";
import ContentCarousel from "../components/ContentCarousel";
import TeamSection from "../components/TeamSection";

const Explore: React.FC = () => {
  // Group content items by categories
  const categorizedContent = contentItems.reduce((acc, item) => {
    item.categories.forEach((category) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    });
    return acc;
  }, {} as Record<string, typeof contentItems>);

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

      <main className="container mx-auto px-4 pb-8 max-w-full relative z-10">
        {/* Page title */}
        <div className="pt-24 mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white animate-fade-in">
            Explore All Robots
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Browse our complete collection of advanced robotics systems and deployable units
          </p>
        </div>

        {/* Content sections */}
        <div className="relative z-10">
          <div className="space-y-20">
            {uniqueCategories.map((category) => (
              <section key={category} className="category-section min-h-[20vh]">
                <h2 className="text-3xl font-bold mb-8 text-netflix-text text-glow capitalize">
                  {category}
                </h2>
                <div className="glass-panel p-6 rounded-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorizedContent[category].map((item) => (
                      <div
                        key={item.id}
                        className="bg-black/40 hover:bg-black/60 transition-all duration-300 rounded-lg overflow-hidden"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-gray-300 text-sm">
                            {item.description}
                          </p>
                          <a
                            href={`/content/${item.id}`}
                            className="mt-4 inline-block bg-sidebar-accent px-4 py-2 rounded text-white font-semibold text-sm hover:bg-opacity-80 transition-colors"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <TeamSection />
        </div>
      </main>
    </div>
  );
};

export default Explore;
