"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useSessionContext } from "@/components/SessionProvider";
import { useToast } from "@/hooks/useToast";
import { Trash2, RefreshCw, ShoppingBag, ArrowLeft, Sun, Moon } from "lucide-react";
import AtomicCartPage from "@/components/templates/AtomicCartPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useThemeContext } from '@/contexts/ThemeContext'; // ✅ استيراد الثيم

const CartPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { sessionId, isLoading: sessionLoading } = useSessionContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  // ✅ استخدام الثيم
  const { theme, toggleTheme, isDark, isLight } = useThemeContext();

  // ✅ دالة الخلفية حسب الثيم
  const getBackgroundGradient = () => {
    if (isLight) {
      return 'linear-gradient(135deg, #96EDD9 0%, #96EDD9 20%, #96EDD9 50%, #96EDD9 80%, #FFFFFF 100%)';
    } else {
      return 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)';
    }
  };

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
    handleCheckout,
  } = useCart();

  // معالجة خطأ السلة مع toast
  useEffect(() => {
    if (error) {
      showToast(`خطأ في السلة: ${error}`, "error");
    }
  }, [error, showToast]);

  // معالجة خطأ الجلسة مع toast
  useEffect(() => {
    if (!sessionLoading && !sessionId) {
      showToast("خطأ: لم يتم العثور على معرف الجلسة", "error");
    }
  }, [sessionLoading, sessionId, showToast]);

  // Toast للسلة الفارغة (مرة واحدة فقط)
  useEffect(() => {
    if (cartData && cartData.items.length === 0) {
      showToast("السلة فارغة - ابدأ التسوق الآن!", "info");
    }
  }, [cartData, showToast]);

  // Handle clear cart with confirmation and toast
  const handleClearCart = async () => {
    if (showClearConfirm) {
      try {
        const itemCount = cartData?.items.length || 0;
        await clearCart();
        setShowClearConfirm(false);
        showToast(`تم تفريغ السلة بنجاح - حُذف ${itemCount} منتج`, "success");
      } catch (error: any) {
        console.error("Error clearing cart:", error);
        showToast(`فشل في تفريغ السلة: ${error.message}`, "error");
      }
    } else {
      setShowClearConfirm(true);
      showToast("انقر مرة أخرى للتأكيد", "warning");
    }
  };

  // Handle refresh cart total with toast
  const handleRefreshTotal = async () => {
    try {
      showToast("جاري تحديث المجموع...", "info");
      await refreshCartTotal();
      await fetchCart();
      showToast("تم تحديث المجموع بنجاح ✓", "success");
    } catch (error: any) {
      console.error("Error refreshing cart total:", error);
      showToast(`خطأ في تحديث المجموع: ${error.message}`, "error");
    }
  };

  // Handle quantity change with toast
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    const item = cartData?.items.find((i) => i.id === itemId);
    if (item) {
      try {
        await updateQuantity(item.cart_item_id, newQuantity);
        showToast(`تم تحديث كمية ${item.name}`, "success");
      } catch (error: any) {
        showToast(`فشل في تحديث الكمية: ${error.message}`, "error");
      }
    }
  };

  // Handle remove item with toast
  const handleRemoveItem = async (itemId: number) => {
    const item = cartData?.items.find((i) => i.id === itemId);
    if (item) {
      try {
        await removeItem(item.cart_item_id);
        showToast(`تم حذف ${item.name} من السلة`, "success");
      } catch (error: any) {
        showToast(`فشل في حذف المنتج: ${error.message}`, "error");
      }
    }
  };

  // Handle remove selected items with toast
  const handleRemoveSelectedItems = async () => {
    if (selectedItems.size === 0) {
      showToast("يرجى اختيار منتجات لحذفها", "warning");
      return;
    }

    try {
      const selectedCount = selectedItems.size;
      await removeSelectedItems();
      showToast(`تم حذف ${selectedCount} منتج محدد`, "success");
    } catch (error: any) {
      showToast(`فشل في حذف المنتجات: ${error.message}`, "error");
    }
  };

  // Handle checkout with validation and toast
  const handleCheckoutClick = async () => {
    if (selectedItems.size === 0) {
      showToast("يرجى اختيار منتج واحد على الأقل للمتابعة", "warning");
      return;
    }

    try {
      showToast("جاري تحضير الطلب...", "info");
      await handleCheckout();
      showToast(`تم تحضير ${selectedItems.size} منتج للطلب ✓`, "success");
      router.push("/Shipping");
    } catch (error: any) {
      console.error("Error during checkout:", error);
      showToast(`خطأ في تحضير الطلب: ${error.message}`, "error");
    }
  };

  // Handle select all with toast
  const handleSelectAllItems = () => {
    const wasAllSelected = selectedItems.size === cartData?.items.length;
    handleSelectAll();

    if (cartData) {
      if (wasAllSelected) {
        showToast("تم إلغاء تحديد جميع المنتجات", "info");
      } else {
        showToast(
          `تم تحديد جميع المنتجات (${cartData.items.length})`,
          "success"
        );
      }
    }
  };

  // Handle retry fetch cart
  const handleRetryFetchCart = async () => {
    try {
      await fetchCart();
    } catch (error: any) {
      showToast(`فشل في إعادة التحميل: ${error.message}`, "error");
    }
  };

  // حالة تحميل الجلسة
  if (sessionLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تحميل جلستك..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  // حالة خطأ في الجلسة
  if (!sessionId) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            خطأ في الجلسة
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            لم يتم العثور على معرف الجلسة. يرجى إعادة تحميل الصفحة.
          </p>
          <button
            onClick={() => {
              showToast("جاري إعادة تحميل الصفحة...", "info");
              window.location.reload();
            }}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isDark 
                ? 'bg-teal-500 hover:bg-teal-400 text-white' 
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }

  // حالة تحميل السلة
  if (cartLoading && !cartData) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تحميل سلة التسوق..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  // حالة الخطأ في جلب السلة
  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            حدث خطأ
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetryFetchCart}
              disabled={cartLoading}
              className={`w-full px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white'
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${cartLoading ? "animate-spin" : ""}`}
              />
              إعادة المحاولة
            </button>
            <button
              onClick={() => {
                showToast("العودة للصفحة الرئيسية", "info");
                router.push("/");
              }}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // حالة السلة فارغة
  if (!cartData || cartData.items.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <ShoppingBag className={`w-12 h-12 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              السلة فارغة
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                router.push("/Stores");
              }}
              className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-teal-500 hover:bg-teal-400 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              تصفح المتاجر
            </button>
          </div>
        </div>
      </div>
    );
  }

  // حالة التحميل أثناء المعالجة
  const isProcessing = cartLoading;

  return (
    <div 
      className="mt-24 relative min-h-screen"
      style={{
        background: getBackgroundGradient(),
        backgroundAttachment: 'fixed',
      }}
    >
      

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          dir="rtl"
        >
          <div className={`rounded-lg p-6 max-w-md mx-4 shadow-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-red-900/50' : 'bg-red-100'
              }`}>
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                تأكيد تفريغ السلة
              </h3>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                هل أنت متأكد من رغبتك في حذف جميع المنتجات (
                {cartData.items.length} منتج) من السلة؟ لا يمكن التراجع عن هذا
                الإجراء.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClearCart}
                  disabled={isProcessing}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  نعم، تفريغ السلة
                </button>
                <button
                  onClick={() => {
                    setShowClearConfirm(false);
                    showToast("تم إلغاء تفريغ السلة", "info");
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* تغطية تحميل أثناء العمليات */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-30">
          <LoadingSpinner
            size="md"
            color="green"
            message="جاري المعالجة..."
            overlay={false}
            pulse={true}
            dots={true}
          />
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
        isLoading={isProcessing}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAllItems}
        onDeleteSelected={handleRemoveSelectedItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutClick}
      />
    </div>
  );
};

export default CartPage;