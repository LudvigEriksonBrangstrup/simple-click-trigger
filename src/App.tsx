
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IndexCopy from "./pages/IndexCopy";
import ContentDetail from "./pages/ContentDetail";
import MyList from "./pages/MyList";
import NewAndPopular from './pages/NewAndPopular';
import Explore from './pages/Explore';
import { ThemeProvider } from "./contexts/ThemeContext";
import { DragAndDropProvider } from "./contexts/DragAndDropContext";
import { UrdfProvider } from "./contexts/UrdfContext";
import { MyListProvider } from './hooks/use-my-list';
import { ProjectsProvider } from './hooks/use-projects';

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UrdfProvider>
            <DragAndDropProvider>
              <MyListProvider>
                <ProjectsProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="old-index" element={<Index />} />
                      <Route path="/" element={<IndexCopy />} />
                      <Route path="/content/:id" element={<ContentDetail />} />
                      <Route path="/my-list" element={<MyList />} />
                      <Route path="*" element={<NotFound />} />
                      <Route path="/new" element={<NewAndPopular />}/>
                      <Route path="/explore" element={<Explore />}/>
                    </Routes>
                  </BrowserRouter>
                </ProjectsProvider>
              </MyListProvider>
            </DragAndDropProvider>
          </UrdfProvider>
        </TooltipProvider>
        {/* https://tanstack.com/query/latest/docs/framework/react/devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
