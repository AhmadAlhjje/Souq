// hooks/useCart.ts - محسن
import { useState, useEffect, useCallback } from 'react';
import { useSessionContext } from '@/components/SessionProvider';
import { useToast } from '@/hooks/useToast';
import { APICartResponse, CartItem } from '@/types/cart';
import { 
  transformCartResponse, 
  parseImages, 
  getProductImageUrl, 
  getFirstProductImage,
  buildImageUrl,
  debugCartItem 
} from '@/utils/cartUtils';
import { CartAPI } from '@/api/cartApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';

export const useCart = () => {
  const { sessionId } = useSessionContext();
  const { showToast } = useToast();
  
  const [cartData, setCartData] = useState<{
    cart_id: number;
    session_id: string;
    created_at: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
  } | null>(null);
  
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch cart using CartAPI service مع تشخيص محسن للصور
   */
  const fetchCart = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching cart with sessionId:', sessionId);
      console.log('🌐 Base URL:', API_BASE_URL);
      
      const apiResponse: APICartResponse = await CartAPI.getOrCreateCart(sessionId);
      
      console.log('✅ API Response received:', apiResponse);
      console.log('📦 Cart Items count:', apiResponse.CartItems?.length || 0);
    
      // تشخيص مفصل للصور
      if (apiResponse.CartItems && apiResponse.CartItems.length > 0) {
        console.log('🖼️ === DETAILED IMAGE DEBUGGING ===');
        
        apiResponse.CartItems.forEach((item, index) => {
          console.log(`\n📸 Item ${index + 1} Analysis:`);
          console.log('Product Name:', item.Product?.name);
          console.log('Raw Images String:', item.Product?.images);
          
        // تحليل البيانات الخام مع فحص النوع
const rawImages = item.Product?.images;
console.log('Images Type:', typeof rawImages);
console.log('Is Array:', Array.isArray(rawImages));

if (Array.isArray(rawImages)) {
  console.log('Array Length:', rawImages.length);
  console.log('Array Contents:', rawImages);
} else if (typeof rawImages === 'string') {
  console.log('String Length:', rawImages.length);
  // ✅ فقط هنا نستخدم startsWith لأننا متأكدين أنه string
  console.log('Starts with [:', rawImages.startsWith('['));
  console.log('Ends with ]:', rawImages.endsWith(']'));
} else {
  console.log('Unexpected type:', typeof rawImages);
}
          // تجربة التحويل
          const parsedImages = parseImages(rawImages);
          console.log('Parsed Array:', parsedImages);
          console.log('Array Length:', parsedImages.length);
          
          // الصورة الأولى
          const firstImage = getFirstProductImage(rawImages);
          console.log('First Image:', firstImage);
          
          // الرابط النهائي
          const finalUrl = getProductImageUrl(item);
          console.log('Final Image URL:', finalUrl);
          
          // اختبار بناء الرابط يدوياً
          if (firstImage) {
            const manualUrl = buildImageUrl(firstImage, API_BASE_URL);
            console.log('Manual Built URL:', manualUrl);
          }
          
          console.log('---');
        });
        
        console.log('🖼️ === END DETAILED DEBUGGING ===');
      }
      
      const transformedData = transformCartResponse(apiResponse);
      
      // عرض النتائج النهائية
      console.log('🔄 Transformed cart data:', {
        itemCount: transformedData.items.length,
        subtotal: transformedData.subtotal,
        total: transformedData.total
      });
      
      if (transformedData.items.length > 0) {
        console.log('🖼️ Final Results:');
        transformedData.items.forEach((item, index) => {
          console.log(`${index + 1}. ${item.name}: ${item.image}`);
        });
      }
      
      setCartData(transformedData);
      
      const allItemIds = new Set(transformedData.items.map((item: CartItem) => item.id));
      setSelectedItems(allItemIds);

      console.log('✅ Cart data set successfully');

    } catch (err) {
      console.error('❌ Full error object:', err);
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل السلة';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showToast]);const addToCart = async (productId: number, quantity: number = 1) => {
  if (!sessionId) {
    showToast('جلسة غير صحيحة', 'error');
    return;
  }

  setIsLoading(true);
  try {
    console.log('➕ Adding item to cart via CartAPI:', {
      productId,
      quantity,
      sessionId
    });

    await CartAPI.addItem(sessionId, productId, quantity);

    console.log('✅ Item added successfully, refreshing cart...');
    await fetchCart();
    showToast('تم إضافة المنتج بنجاح تابع الشحن   ', 'success');
  } catch (err) {
    console.error('❌ Add to cart error:', err);

    let userFriendlyMessage = 'فشل في إضافة المنتج للسلة';

    if (err instanceof Error) {
      // ✅ إذا كانت الرسالة تحتوي على JSON من الخادم
      if (err.message.includes('{"error":')) {
        try {
          // استخراج النص من {"error":"..."}
          const jsonMatch = err.message.match(/\{"error":"(.*?)"\}/);
          if (jsonMatch && jsonMatch[1]) {
            const rawError = jsonMatch[1];
            // ✅ إذا كانت الرسالة تحتوي على "المخزون غير كافٍ"
            if (rawError.includes("المخزون غير كافٍ")) {
              userFriendlyMessage = "الكمية المطلوبة غير متوفرة";
            } else {
              userFriendlyMessage = rawError; // استخدام الرسالة الأصلية إذا لم نعرفها
            }
          }
        } catch (e) {
          console.warn("فشل في تحليل رسالة الخطأ:", e);
        }
      } else {
        userFriendlyMessage = err.message;
      }
    }

    // ✅ عرض الرسالة النظيفة للمستخدم
    showToast(userFriendlyMessage, 'error');
    throw err;
  } finally {
    setIsLoading(false);
  }
};
  /**
   * Update item quantity using CartAPI
   */
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (!sessionId || newQuantity < 1) return;

    setIsLoading(true);
    try {
      await CartAPI.updateItem(sessionId, cartItemId, newQuantity);
      await fetchCart();
      showToast('تم تحديث الكمية بنجاح', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث الكمية';
      showToast(errorMessage, 'error');
      console.error('Error updating quantity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove single item using CartAPI
   */
  const removeItem = async (cartItemId: number) => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      await CartAPI.removeItem(sessionId, cartItemId);

      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });

      await fetchCart();
      showToast('تم حذف المنتج من السلة', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في حذف المنتج';
      showToast(errorMessage, 'error');
      console.error('Error removing item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove selected items (multiple delete)
   */
  const removeSelectedItems = async () => {
    if (!sessionId || selectedItems.size === 0) {
      showToast('لم يتم اختيار أي منتجات للحذف', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const deletePromises = Array.from(selectedItems).map(itemId =>
        CartAPI.removeItem(sessionId, itemId)
      );

      await Promise.all(deletePromises);
      setSelectedItems(new Set());
      await fetchCart();
      showToast(`تم حذف ${selectedItems.size} منتج من السلة`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في حذف المنتجات';
      showToast(errorMessage, 'error');
      console.error('Error removing selected items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear entire cart using CartAPI
   */
  const clearCart = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      await CartAPI.clearCart(sessionId);
      setCartData(null);
      setSelectedItems(new Set());
      showToast('تم تفريغ السلة بالكامل', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تفريغ السلة';
      showToast(errorMessage, 'error');
      console.error('Error clearing cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get cart total using CartAPI
   */
  const refreshCartTotal = async () => {
    if (!sessionId) return;

    try {
      const totalData = await CartAPI.getCartTotal(sessionId);
      console.log('Cart total from API:', totalData);
      return totalData;
    } catch (err) {
      console.error('Error getting cart total:', err);
      throw err;
    }
  };

  /**
   * Handle item selection
   */
  const handleSelectItem = (itemId: number, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  /**
   * Handle select all
   */
  const handleSelectAll = () => {
    if (!cartData) return;

    const allItemIds = cartData.items.map((item: CartItem) => item.id);
    const allSelected = selectedItems.size === allItemIds.length;

    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allItemIds));
    }
  };

  /**
   * Handle checkout
   */
  const handleCheckout = async () => {
    if (!sessionId || selectedItems.size === 0) {
      showToast('يرجى اختيار منتجات للمتابعة', 'warning');
      return;
    }

    try {
      await refreshCartTotal();
      showToast('جاري التوجه لصفحة الدفع...', 'info');
    } catch (err) {
      console.error('Error during checkout preparation:', err);
      showToast('حدث خطأ أثناء تحضير الدفع', 'error');
    }
  };

  // Load cart on mount
  useEffect(() => {
    if (sessionId) {
      console.log('🚀 useCart: Loading cart for session:', sessionId);
      fetchCart();
    }
  }, [sessionId, fetchCart]);

  return {
    cartData,
    selectedItems,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    removeSelectedItems,
    clearCart,
    refreshCartTotal,
    handleSelectItem,
    handleSelectAll,
    handleCheckout
  };
};

// Utility Hook for Adding Items to Cart
export const useAddToCart = () => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (productId: number, quantity: number = 1) => {
    try {
      await addToCart(productId, quantity);
      return true;
    } catch (error) {
      console.error('Add to cart error:', error);
      return false;
    }
  };

  return { handleAddToCart };
};