"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useSessionContext } from "@/components/SessionProvider";
import { useToast } from "@/hooks/useToast";
import { Trash2, RefreshCw, ShoppingBag, ArrowLeft } from "lucide-react";
import AtomicCartPage from "@/components/templates/AtomicCartPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CartPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
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
      showToast("تم تحديhandleCheckoutClick ث المجموع بنجاح ✓", "success");
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
      showToast("جاري إعادة تحميل السلة...", "info");
      await fetchCart();
      showToast("تم تحميل السلة بنجاح ✓", "success");
    } catch (error: any) {
      showToast(`فشل في إعادة التحميل: ${error.message}`, "error");
    }
  };

  // حالة تحميل الجلسة
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            خطأ في الجلسة
          </h2>
          <p className="text-gray-600 mb-6">
            لم يتم العثور على معرف الجلسة. يرجى إعادة تحميل الصفحة.
          </p>
          <button
            onClick={() => {
              showToast("جاري إعادة تحميل الصفحة...", "info");
              window.location.reload();
            }}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetryFetchCart}
              disabled={cartLoading}
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
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
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              السلة فارغة
            </h2>
            <p className="text-gray-600 mb-6">
              لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                router.push("/Stores");
              }}
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
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
    <div className="mt-24 relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          dir="rtl"
        >
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تأكيد تفريغ السلة
              </h3>
              <p className="text-gray-600 mb-6">
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
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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
