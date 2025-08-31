"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StoreContextType {
  storeId: number | null;
  setStoreId: (id: number | null) => void;
  isLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [storeId, setStoreIdState] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // جلب storeId من localStorage عند تحميل المكون .
  useEffect(() => {
    try {
      const savedStoreId = localStorage.getItem('storeId');
      console.log('Loading storeId from localStorage:', savedStoreId); // للتشخيص
      
      if (savedStoreId && savedStoreId !== 'null' && savedStoreId !== 'undefined') {
        const parsedId = parseInt(savedStoreId, 10);
        if (!isNaN(parsedId)) {
          setStoreIdState(parsedId);
          console.log('StoreId loaded successfully:', parsedId); // للتشخيص
        }
      }
    } catch (error) {
      console.error('Error loading storeId from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // دالة لتعيين storeId وحفظه في localStorage
  const setStoreId = (id: number | null) => {
    console.log('Setting storeId:', id); // للتشخيص
    setStoreIdState(id);
    
    try {
      if (id !== null) {
        localStorage.setItem('storeId', id.toString());
        console.log('StoreId saved to localStorage:', id); // للتشخيص
      } else {
        localStorage.removeItem('storeId');
        console.log('StoreId removed from localStorage'); // للتشخيص
      }
    } catch (error) {
      console.error('Error saving storeId to localStorage:', error);
    }
  };

  return (
    <StoreContext.Provider value={{ storeId, setStoreId, isLoaded }}> 
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};