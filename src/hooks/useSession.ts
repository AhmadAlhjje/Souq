
// ========================================
// 2. src/hooks/useSession.ts - Hook للـ Session Management
// ========================================

import { useState, useEffect } from 'react';
import { SessionManager } from '@/utils/SessionManager';

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تهيئة الـ session عند تحميل المكون
    const initSession = () => {
      try {
        const id = SessionManager.getOrCreateSessionId();
        setSessionId(id);
        console.log('🎯 Session initialized:', id);
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // إنشاء session احتياطي
        const fallbackId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        setSessionId(fallbackId);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // اختياري: تمديد الـ session عند نشاط المستخدم
    const handleUserActivity = () => {
      SessionManager.extendSession();
    };

    // الاستماع لأحداث نشاط المستخدم
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // تنظيف Event Listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, []);

  const refreshSession = () => {
    const newSessionId = SessionManager.getOrCreateSessionId();
    setSessionId(newSessionId);
    return newSessionId;
  };

  const clearSession = () => {
    SessionManager.clearSession();
    setSessionId(null);
  };

  const getSessionInfo = () => {
    return SessionManager.getSessionInfo();
  };

  return {
    sessionId,
    isLoading,
    refreshSession,
    clearSession,
    getSessionInfo,
    isValid: SessionManager.isSessionValid()
  };
};
