// app/cart/page.tsx or pages/cart.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useSessionContext } from '@/components/SessionProvider';
import { Trash2, RefreshCw, ShoppingBag, ArrowLeft } from 'lucide-react';
import AtomicCartPage from '@/components/templates/AtomicCartPage';

const CartPage = () => {
  const router = useRouter();
  const { sessionId, isLoading: sessionLoading } = useSessionContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  
  const {
    cartData,
    selectedItems,
    isLoading: cartLoading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    removeSelectedItems,
    clearCart,
    refreshCartTotal,
    handleSelectItem,
    handleSelectAll,
    handleCheckout
  } = useCart();

  // تحديث وقت آخر تحديث
  useEffect(() => {
    if (cartData) {
      setLastRefreshTime(new Date());
    }
  }, [cartData]);

  // Handle clear cart with confirmation
  const handleClearCart = async () => {
    if (showClearConfirm) {
      try {
        await clearCart();
        setShowClearConfirm(false);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setShowClearConfirm(true);
    }
  };

  // Handle refresh cart total
  const handleRefreshTotal = async () => {
    try {
      await refreshCartTotal();
      await fetchCart(); // تحديث البيانات بعد حساب المجموع
    } catch (error) {
      console.error('Error refreshing cart total:', error);
    }
  };

  // Handle checkout with validation
  const handleCheckoutClick = async () => {
    if (selectedItems.size === 0) {
      alert('يرجى اختيار منتج واحد على الأقل للمتابعة');
      return;
    }
    
    try {
      await handleCheckout();
      // يمكنك إضافة navigation للدفع هنا
      // router.push('/checkout');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الجلسة...</p>
        </div>
      </div>
    );
  }

  // Session error
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطأ في الجلسة</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على معرف الجلسة. يرجى إعادة تحميل الصفحة.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }

  // Cart loading state
  if (cartLoading && !cartData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل السلة...</p>
          <p className="text-sm text-gray-500 mt-2">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={fetchCart}
              disabled={cartLoading}
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${cartLoading ? 'animate-spin' : ''}`} />
              إعادة المحاولة
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
            <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
            <p className="text-sm text-gray-500 mb-6">ابدأ التسوق واختر من بين مئات المنتجات المتاحة</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              تصفح المنتجات
            </button>
            <button 
              onClick={fetchCart}
              disabled={cartLoading}
              className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm disabled:opacity-50"
            >
              تحديث السلة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">تأكيد تفريغ السلة</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من رغبتك في حذف جميع المنتجات ({cartData.items.length} منتج) من السلة؟ 
                لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClearCart}
                  disabled={cartLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  نعم، تفريغ السلة
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Cart Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">سلة التسوق</h1>
                <p className="text-sm text-gray-500">
                  {cartData.items.length} منتج | {selectedItems.size} محدد
                  {lastRefreshTime && (
                    <span className="ml-2">
                      | آخر تحديث: {lastRefreshTime.toLocaleTimeString('ar')}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleRefreshTotal}
                disabled={cartLoading}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${cartLoading ? 'animate-spin' : ''}`} />
                تحديث المجموع
              </button>
              <button
                onClick={handleClearCart}
                disabled={cartLoading || cartData.items.length === 0}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                تفريغ السلة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {cartLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
              <span className="text-gray-700">جاري المعالجة...</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Cart Component */}
      <AtomicCartPage
        items={cartData.items}
        selectedItems={selectedItems}
        subtotal={cartData.subtotal}
        deliveryFee={cartData.deliveryFee}
        tax={cartData.tax}
        total={cartData.total}
        isLoading={cartLoading}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        onDeleteSelected={removeSelectedItems}
        onQuantityChange={(itemId: number, newQuantity: number) => {
          const item = cartData.items.find(i => i.id === itemId);
          if (item) {
            updateQuantity(item.cart_item_id, newQuantity);
          }
        }}
        onRemoveItem={(itemId: number) => {
          const item = cartData.items.find(i => i.id === itemId);
          if (item) {
            removeItem(item.cart_item_id);
          }
        }}
        onCheckout={handleCheckoutClick}
        onBackToShopping={() => router.push('/')}
      />

      {/* Quick Stats Footer */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex gap-6">
              <span>المنتجات: {cartData.items.length}</span>
              <span>المحدد: {selectedItems.size}</span>
              <span>إجمالي الكمية: {cartData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex gap-4">
              <span>الإجمالي: {cartData.total.toFixed(2)} ر.س</span>
              <span className="text-teal-600">Session: {sessionId.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;