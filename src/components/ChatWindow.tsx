
import React, { useState, useRef, useEffect } from 'react';
import { contentItems } from '../data/content';
import { Send } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<{
    sender: string;
    text: string;
    imageUrl?: string;
  }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchLLMResponseChunked = async (userMessage: string, onChunk: (chunk: string) => void): Promise<void> => {
    // Use contentItems instead of hardcoded movies
    let selectedItem;
    if (userMessage.toLowerCase().includes("construction")) {
      selectedItem = contentItems.find(item => item.title.toLowerCase().includes("Go2"));
    } else if (userMessage.toLowerCase().includes("cute")) {
      selectedItem = contentItems.find(item => item.title.toLowerCase().includes("Cassie"));
    } else {
      selectedItem = contentItems[3]; // Default to the first item
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

    // Add the image URL as the final chunk
    onChunk(`__IMAGE__${selectedItem.imageUrl}`);
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
            if (chunk.startsWith('__IMAGE__')) {
              lastMessage.imageUrl = chunk.replace('__IMAGE__', '');
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

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }, 50); // Add a slight delay to ensure the DOM is updated
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[rgba(10,10,20,0.8)] backdrop-blur-lg text-white">
      {/* Messages area */}
      <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto">
        <div ref={chatContainerRef}>
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-400 italic">
              Ask me about our robots, and I'll help you find the perfect fit for your needs.
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
              
              {message.imageUrl && (
                <div className="mt-3 transition-all duration-300 hover:scale-105">
                  <img 
                    src={message.imageUrl} 
                    alt="Robot" 
                    className="rounded-lg w-auto shadow-lg border border-white/10" 
                    style={{ maxHeight: '260px' }} 
                  />
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
        </div>
      </ScrollArea>
      
      {/* Input area - fixed at bottom */}
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
            disabled={loading}
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
