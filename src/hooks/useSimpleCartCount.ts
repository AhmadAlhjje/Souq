// hooks/useSimpleCartCount.ts
import { useState, useEffect, useRef } from 'react';
import { useSessionContext } from '@/components/SessionProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';

// متغير عام لمشاركة العدد بين جميع المكونات
let globalCartCount = 0;
const countListeners: ((count: number) => void)[] = [];

// وظائف للتحكم بالعدد عالمياً
export const updateGlobalCartCount = (newCount: number) => {
  globalCartCount = newCount;
  // إخطار جميع المكونات المستمعة
  countListeners.forEach(listener => listener(newCount));
};

export const incrementCartCount = () => {
  updateGlobalCartCount(globalCartCount + 1);
};

export const decrementCartCount = () => {
  updateGlobalCartCount(Math.max(0, globalCartCount - 1));
};

export const useSimpleCartCount = () => {
  const { sessionId } = useSessionContext();
  const [count, setCount] = useState(globalCartCount);
  const listenerRef = useRef<((count: number) => void) | null>(null);

  // إضافة مستمع للتحديثات
  useEffect(() => {
    const listener = (newCount: number) => setCount(newCount);
    listenerRef.current = listener;
    countListeners.push(listener);

    return () => {
      if (listenerRef.current) {
        const index = countListeners.indexOf(listenerRef.current);
        if (index > -1) {
          countListeners.splice(index, 1);
        }
      }
    };
  }, []);

  // جلب العدد من API
  useEffect(() => {
    if (!sessionId) {
      updateGlobalCartCount(0);
      return;
    }

    const fetchCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cart/get-or-create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': sessionId,
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (response.ok) {
          const data = await response.json();
          const itemCount = data.CartItems?.length || 0;
          updateGlobalCartCount(itemCount);
        } else {
          updateGlobalCartCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
        updateGlobalCartCount(0);
      }
    };

    fetchCount();

    // تحديث دوري كل 10 ثوانِ (اختياري)
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [sessionId]);

  return count;
};