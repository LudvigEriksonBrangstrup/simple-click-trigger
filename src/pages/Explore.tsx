
import React, { useState } from "react";
import { contentItems } from "../data/content";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import TeamSection from "../components/TeamSection";
import { ContentItem } from "../types/content";
import ChatWindow from "../components/ChatWindow";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Explore: React.FC = () => {
  const [chatVisible, setChatVisible] = useState(true);

  // Group content items by categories
  const categorizedContent = contentItems.reduce((acc, item) => {
    item.categories.forEach((category) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    });
    return acc;
  }, {} as Record<string, ContentItem[]>);

  // Get unique categories
  const uniqueCategories = Object.keys(categorizedContent).sort();

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

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

      <div className="flex relative z-10 pt-24">
        {/* Chat sidebar with toggle button */}
        <div 
          className={`fixed top-24 bottom-0 transition-all duration-300 ease-in-out z-20 ${
            chatVisible ? "left-0" : "-left-full"
          }`} 
          style={{ width: "33.333%" }}
        >
          <div className="h-full bg-[rgba(10,10,20,0.8)] backdrop-blur-lg border border-white/10 rounded-r-lg shadow-xl">
            <div className="flex-1 h-full overflow-hidden">
              <ChatWindow />
            </div>
          </div>
        </div>
        
        {/* Toggle button - now more sleek and compact */}
        <button 
          onClick={toggleChat}
          className={`fixed z-30 top-1/2 transform -translate-y-1/2 transition-all duration-300 bg-[rgba(10,10,20,0.75)] backdrop-blur-sm hover:bg-blue-700/75 text-white p-2 shadow-lg border border-white/10 ${
            chatVisible 
              ? "left-[calc(33.333%-1px)] rounded-r-md" 
              : "left-0 rounded-r-md"
          }`}
          aria-label={chatVisible ? "Hide chat" : "Show chat"}
        >
          {chatVisible ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Main content area */}
        <main 
          className={`transition-all duration-300 ease-in-out pb-8 ${
            chatVisible ? "ml-[33.333%]" : "ml-0"
          } w-full`}
        >
          <div className="container mx-auto px-4 max-w-full">
            {/* Page title */}
            <div className="mb-12 text-center">
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
                    <Carousel 
                      title={category} 
                      items={categorizedContent[category]} 
                      className="glass-panel p-6 rounded-xl"
                    />
                  </section>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="mt-20">
              <TeamSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
