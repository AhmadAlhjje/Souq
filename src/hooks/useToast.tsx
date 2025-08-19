'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/atoms/Toast';

// 🔹 تعريف نوع الرسائل
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// 🔹 السياق
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 🔹 مزود السياق
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </ToastContext.Provider>
  );
};

// 🔹 hook لاستخدام Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};