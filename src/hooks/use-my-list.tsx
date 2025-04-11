
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ContentItem } from '../types/content';

interface MyListContextType {
  myList: ContentItem[];
  addToMyList: (item: ContentItem) => void;
  removeFromMyList: (id: string) => void;
  isInMyList: (id: string) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<ContentItem[]>([]);

  // Load saved items from local storage
  useEffect(() => {
    const savedList = localStorage.getItem('myList');
    if (savedList) {
      try {
        setMyList(JSON.parse(savedList));
      } catch (error) {
        console.error('Failed to parse saved list:', error);
      }
    }
  }, []);

  // Save items to local storage when list changes
  useEffect(() => {
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  const addToMyList = (item: ContentItem) => {
    setMyList((prev) => {
      // Only add if not already in list
      if (!prev.some((listItem) => listItem.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromMyList = (id: string) => {
    setMyList((prev) => prev.filter((item) => item.id !== id));
  };

  const isInMyList = (id: string) => {
    return myList.some((item) => item.id === id);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};
