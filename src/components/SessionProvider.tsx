"use client"
// components/SessionProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from '../hooks/useSession';

interface SessionContextType {
  sessionId: string | null;
  isLoading: boolean;
  refreshSession: () => string;
  clearSession: () => void;
  getSessionInfo: () => {
    sessionId: string | null;
    isValid: boolean;
    expiresAt: Date | null;
  };
  isValid: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const sessionData = useSession();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
