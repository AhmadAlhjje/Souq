// hooks/useCartCount.ts
import { useState, useEffect, useCallback } from 'react';
import { useSessionContext } from '@/components/SessionProvider';
import { APICartResponse, CartItem } from '@/types/cart';
import { transformCartResponse } from '@/utils/cartUtils';
import { CartAPI } from '@/api/cartApi';

/**
 * Hook خفيف للحصول على عدد المنتجات في السلة فقط
 * بدون استخدام toast لتجنب مشاكل Provider
 */
export const useCartCount = () => {
  const { sessionId } = useSessionContext();
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCartCount = useCallback(async () => {
    if (!sessionId) {
      setItemCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const apiResponse: APICartResponse = await CartAPI.getOrCreateCart(sessionId);
      const transformedData = transformCartResponse(apiResponse);
      
      // حساب عدد المنتجات (أو الكمية الإجمالية)
      const count = transformedData.items.length;
      // أو للكمية الإجمالية:
      // const count = transformedData.items.reduce((total, item) => total + item.quantity, 0);
      
      setItemCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setItemCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // تحميل العدد عند بدء التشغيل
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // تحديث العدد كل 30 ثانية (اختياري)
  useEffect(() => {
    const interval = setInterval(fetchCartCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCartCount]);

  return {
    itemCount,
    isLoading,
    refreshCount: fetchCartCount
  };
};