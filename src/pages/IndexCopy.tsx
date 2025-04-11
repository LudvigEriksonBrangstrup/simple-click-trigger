
import React, { useEffect, useRef, useState } from "react";
import { categories } from "../data/content";
import ContentCarousel from "../components/ContentCarousel";
import Header from "../components/Header";
import ChatWindow from "../components/ChatWindow";
import TeamSection from "../components/TeamSection";

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
    const categoryElements =
      document.querySelectorAll<HTMLElement>(".category-section");
    sectionRefs.current = Array.from(categoryElements);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
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
        {/* Cosmic hero section with parallax text */}
        <section className="relative overflow-hidden">
          <div className="w-full h-[160vh] relative mb-8 flex items-start justify-center">
            {/* Parallax text container */}
            <div className="relative z-10 text-left px- md:px-0 max-w-6xl mx-auto mt-24 pt-16">
              <h1 className="text-7xl md:text-[13rem] font-bold tracking-tighter whitespace-nowrap text-white animate-fade-in text-glow leading-none font-sans">
                <span className="block -mb-12 text-gradient-white">BUILD</span>
                <span className="block -mb-12 text-gradient-white">
                  SPATIAL
                </span>
                <span className="block text-gradient-white pb-4">AGENTS</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Content sections with glass panels */}
        <div className="relative z-10">
          {/* Chat Window Section */}
          <section className="mb-60 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-netflix-text text-center">
              Talk to Our AI Assistant
            </h2>
            <div className="glass-panel">
              <ChatWindow />
            </div>
          </section>

          {/* Team Section */}
          <TeamSection />

          <div className="space-y-20 mt-12">
            {/* Increased spacing between categories for parallax effect */}
            {categories.map((category, index) => (
              <section
                key={category.id}
                className="category-section min-h-[20vh]"
              >
                <h2 className="text-3xl font-bold mb-8 text-netflix-text text-glow">
                  {category.name}
                </h2>
                <ContentCarousel key={category.id} category={category} />
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IndexCopy;
