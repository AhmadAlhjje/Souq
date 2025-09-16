// ========================================
// 3. تحديث SessionManager لدعم Sub-Sessions
// ========================================

export class SessionManager {
  private static SESSION_KEY = 'user_session_id';
  private static SUB_SESSION_COUNTER_KEY = 'sub_session_counter';

  private static generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2);
    const browserInfo = typeof window !== 'undefined' 
      ? window.navigator.userAgent.slice(-10).replace(/[^a-zA-Z0-9]/g, '') 
      : 'server';
    
    return `session_${timestamp}_${randomStr}_${browserInfo}`;
  }

  static getOrCreateSessionId(): string {
    if (typeof window === 'undefined') {
      return this.generateSessionId();
    }

    try {
      const existingSession = localStorage.getItem(this.SESSION_KEY);

      if (existingSession) {
        console.log('♻️ استخدام session موجود:', existingSession);
        return existingSession;
      }

      const newSessionId = this.generateSessionId();
      localStorage.setItem(this.SESSION_KEY, newSessionId);
      localStorage.setItem(this.SUB_SESSION_COUNTER_KEY, '0');

      console.log('🆕 إنشاء session جديد:', newSessionId);
      return newSessionId;

    } catch (error) {
      console.error('Error managing session:', error);
      return this.generateSessionId();
    }
  }

  static getCurrentSessionId(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SUB_SESSION_COUNTER_KEY);
      console.log('🗑️ تم مسح الـ session');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // ✅ تم التعديل: إزالة console.log الذي يسبب المشكلة
  static extendSession(): void {
    // لا حاجة للتمديد — الجلسة دائمة حسب التصميم
    // أي محاولة لعرض console.log هنا قد تُفسر كخطأ في الواجهة
  }

  static isSessionValid(): boolean {
    return this.getCurrentSessionId() !== null;
  }

  static getSessionInfo(): {
    sessionId: string | null;
    isValid: boolean;
    expiresAt: Date | null;
    isPersistent: boolean; // ✅ إضافة لدعم الجلسة الدائمة
  } {
    const sessionId = this.getCurrentSessionId();
    const isValid = sessionId !== null;

    return {
      sessionId,
      isValid,
      expiresAt: null,
      isPersistent: true, // ✅ دائم
    };
  }

  // دالة جديدة لإنشاء sub-session
  static createSubSession(): string {
    const mainSession = this.getOrCreateSessionId();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4);
    
    return `${mainSession}_sub_${timestamp}_${random}`;
  }
}