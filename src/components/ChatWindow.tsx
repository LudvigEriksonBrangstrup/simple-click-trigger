
import React, { useState, useRef, useEffect } from 'react';
import { Send, Archive, Database, Globe, Brain } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import ProjectSelector from './ProjectSelector';
import { ContentItem } from '@/types/content';
import { useMyList } from '@/hooks/use-my-list';
import { cn } from '@/lib/utils';
import { useSupabaseRobots } from '@/hooks/use-supabase-robots';

// Available tool types
const TOOLS = ['database', 'internet', 'thinking'] as const;
type ToolType = typeof TOOLS[number];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<{
    sender: string;
    text: string;
    robotData?: ContentItem;
    tool?: ToolType;
  }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolLoading, setToolLoading] = useState<ToolType | null>(null);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<ContentItem | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isInMyList } = useMyList();
  const { robots, isLoading: robotsLoading } = useSupabaseRobots();

  const getRandomTool = (): ToolType => {
    const randomIndex = Math.floor(Math.random() * TOOLS.length);
    return TOOLS[randomIndex];
  };

  const fetchLLMResponseChunked = async (userMessage: string, onChunk: (chunk: string) => void): Promise<void> => {
    const shouldUseTool = Math.random() > 0.3; // 70% chance of using a tool
    
    if (shouldUseTool) {
      const tool = getRandomTool();
      setToolLoading(tool);
      
      await new Promise(resolve => setTimeout(resolve, 4000));
      setToolLoading(null);
      
      onChunk(`__TOOL__${tool}`);
    }
    
    let selectedItem;
    // Use our fetched robots instead of contentItems
    if (robots.length > 0) {
      if (userMessage.toLowerCase().includes("construction")) {
        selectedItem = robots.find(item => item.title.toLowerCase().includes("Go2"));
      } else if (userMessage.toLowerCase().includes("cute")) {
        selectedItem = robots.find(item => item.title.toLowerCase().includes("Cassie"));
      } else {
        // Select a random robot if no specific match
        const randomIndex = Math.floor(Math.random() * robots.length);
        selectedItem = robots[randomIndex];
      }
    }
    
    if (!selectedItem) {
      onChunk("Sorry, I couldn't find a suitable recommendation.");
      return;
    }
    
    const fullResponse = `Based on your request, I recommend the robot ${selectedItem.title}\n${selectedItem.description}`;
    const words = fullResponse.split(' ');
    
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onChunk(word + ' ');
    }

    onChunk(`__DATA__${selectedItem.id}`);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages([...messages, {
        sender: 'User',
        text: userMessage
      }]);
      setInput('');
      setLoading(true);
      
      setMessages(prev => [...prev, {
        sender: 'Bot',
        text: ''
      }]);
      
      await fetchLLMResponseChunked(userMessage, chunk => {
        setMessages(prev => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          
          if (lastMessage.sender === 'Bot') {
            if (chunk.startsWith('__DATA__')) {
              const robotId = chunk.replace('__DATA__', '');
              const robot = robots.find(item => item.id === robotId);
              if (robot) {
                lastMessage.robotData = robot;
              }
            } else if (chunk.startsWith('__TOOL__')) {
              const tool = chunk.replace('__TOOL__', '') as ToolType;
              lastMessage.tool = tool;
            } else {
              lastMessage.text += chunk;
            }
          }
          
          return updatedMessages;
        });
      });
      
      setLoading(false);
    }
  };

  const handleArchiveClick = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    setSelectedRobot(item);
    setIsProjectSelectorOpen(true);
  };

  const handleCloseProjectSelector = () => {
    setIsProjectSelectorOpen(false);
    setSelectedRobot(null);
  };

  const getToolIcon = (tool: ToolType) => {
    switch (tool) {
      case 'database':
        return <Database size={16} className="mr-2 text-blue-400" />;
      case 'internet':
        return <Globe size={16} className="mr-2 text-green-400" />;
      case 'thinking':
        return <Brain size={16} className="mr-2 text-purple-400" />;
      default:
        return null;
    }
  };

  const getToolDescription = (tool: ToolType) => {
    switch (tool) {
      case 'database':
        return "Fetching from database";
      case 'internet':
        return "Searching the internet";
      case 'thinking':
        return "Thinking deeply";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }, 50); // Add a slight delay to ensure the DOM is updated
    }
  }, [messages, toolLoading]);

  // Return loading state if robots aren't loaded yet
  if (robotsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-white">Loading robots data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent text-white">
      <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto max-h-[500px]">
        <div ref={chatContainerRef} className="h-full">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-400 italic">
              Describe what you need a robot for, and I'll help you find the perfect fit for your needs.
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.sender === 'User' ? 'text-right' : 'text-left'} animate-fade-in`}
            >
              <div className="flex items-start gap-2 mb-1">
                <span className={`text-sm font-semibold ${message.sender === 'User' ? 'ml-auto' : ''}`}>
                  {message.sender === 'User' ? 'You' : 'Assistant'}
                </span>
              </div>
              
              {message.tool && (
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  {getToolIcon(message.tool)}
                  <span>Used tool: {getToolDescription(message.tool)}</span>
                </div>
              )}
              
              <span 
                className={`inline-block px-4 py-3 rounded-lg ${
                  message.sender === 'User' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700/70'
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {message.text}
              </span>
              
              {message.robotData && (
                <div className="mt-3">
                  <div className="carousel-item flex-shrink-0 cursor-pointer relative hover:z-10 w-full max-w-[260px]">
                    <div className="relative rounded-md w-full h-full group/item">
                      <div className="rounded-md overflow-hidden w-full h-full bg-black">
                        <img 
                          src={message.robotData.imageUrl} 
                          alt={message.robotData.title} 
                          className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover/item:brightness-90" 
                          style={{
                            aspectRatio: '0.8',
                            maxHeight: '260px'
                          }} 
                        />
                      </div>
                      <div className="absolute top-4 right-4 p-2 z-20 invisible group-hover/item:visible" onClick={e => handleArchiveClick(e, message.robotData!)}>
                        <Archive size={24} className={cn("transition-colors duration-300", isInMyList(message.robotData.id) ? "fill-blue-400 text-blue-400" : "text-white hover:text-blue-400")} />
                      </div>
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <h3 className="text-gray-400 text-2xl font-bold drop-shadow-xl">{message.robotData.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="text-left animate-pulse">
              <span className="inline-block px-4 py-3 rounded-lg bg-gray-700/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </span>
            </div>
          )}
          
          {toolLoading && (
            <div className="text-left mt-2 mb-4">
              <div className="flex items-center text-sm text-gray-400 animate-pulse">
                {getToolIcon(toolLoading)}
                <span>{getToolDescription(toolLoading)}...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center relative">
          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            rows={1} 
            placeholder="Type your message..."
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 px-4 py-4 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/25 resize-none overflow-hidden pr-12 border border-white/5"
          />
          <button 
            onClick={handleSend} 
            className="absolute right-2 bottom-2 p-2.5 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading || toolLoading !== null}
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
      
      {selectedRobot && (
        <ProjectSelector 
          isOpen={isProjectSelectorOpen}
          onClose={handleCloseProjectSelector}
          contentItem={selectedRobot}
        />
      )}
    </div>
  );
};

export default ChatWindow;
