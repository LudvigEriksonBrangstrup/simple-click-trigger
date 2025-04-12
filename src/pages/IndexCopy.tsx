
import React, { useEffect, useRef, useState } from "react";
import { categories } from "../data/content";
import ContentCarousel from "../components/ContentCarousel";
import Header from "../components/Header";
import ChatWindow from "../components/ChatWindow";
import TeamSection from "../components/TeamSection";
import SplineViewer from "../components/SplineViewer";

const IndexCopy: React.FC = () => {
  // const parallaxRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const ticking = useRef<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);

  // Add parallax effect on scroll using requestAnimationFrame for better performance
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Initialize section references
    const categoryElements = document.querySelectorAll<HTMLElement>(".category-section");
    sectionRefs.current = Array.from(categoryElements);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only get the trending category
  const trendingCategory = categories.find(category => category.id === "trending");

  return <div className="min-h-screen bg-netflix-background text-netflix-text">
      <Header />

      {/* Cosmic background wrapper for the entire page */}
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
        {/* Cosmic hero section with strict container separation */}
        <section className="relative overflow-visible mt-24 pt-10">
          {/* Create a grid layout to ensure separation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Text container - strictly confined to left side with hard width limit */}
            <div className="z-10 text-left px-0 flex flex-col w-full md:w-[50%] overflow-hidden">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter whitespace-nowrap text-white animate-fade-in text-glow leading-none font-sans">
                <span className="block -mb-10 text-gradient-white">PROMPT</span>
                <span className="block -mb-10 text-gradient-white">
                  SPATIAL
                </span>
                <span className="block text-gradient-white pb-4">AGENTS</span>
              </h1>
            </div>
            
            {/* Spline container - strictly confined to right side */}
            <div className="relative z-10 h-[500px] md:h-[600px] w-full overflow-visible flex justify-center items-center">
              <SplineViewer 
                splineUrl="https://prod.spline.design/Ze6evzKLyY-Xq6uh/scene.splinecode" 
                className="h-full w-full overflow-visible"
                scale={1.5}
                enableInteraction={true}
              />
            </div>
          </div>
        </section>

        {/* Chat Window Section - Below the hero section */}
        <section className="mt-20 mb-20 max-w-4xl mx-auto">
          <div className="glass-panel">
            <ChatWindow />
          </div>
        </section>

        {/* Content sections with glass panels */}
        <div className="relative z-10">
          {/* Team Section */}
          <TeamSection />

          {/* Only display trending category */}
          {trendingCategory && <section className="category-section min-h-[20vh] mt-12">
              <h2 className="text-3xl font-bold mb-8 text-netflix-text text-glow">
                {trendingCategory.name}
              </h2>
              <ContentCarousel key={trendingCategory.id} category={trendingCategory} />
              <div className="mt-6 text-center">
                <a href="/explore" className="inline-block bg-sidebar-accent px-6 py-3 rounded-lg text-white font-semibold hover:bg-opacity-80 transition-colors">
                  Explore All Robots
                </a>
              </div>
            </section>}
        </div>
      </main>
    </div>;
};

export default IndexCopy;
