// // hooks/useUnifiedCart.ts
// import { useContext, useEffect } from 'react';
// import { useCart as useCartContext } from '@/contexts/CartContext';
// import { useCart as useCartAPI } from '@/hooks/useCart';
// import { useSessionContext } from '@/components/SessionProvider';

// export const useUnifiedCart = () => {
//   const { sessionId } = useSessionContext();
  
//   // Context للحالة المحلية
//   const cartContext = useCartContext();
  
//   // API للتزامن مع السيرفر
//   const cartAPI = useCartAPI();

//   // مزامنة السلة عند تسجيل الدخول
//   useEffect(() => {
//     const syncCartWithServer = async () => {
//       if (sessionId && cartContext.items.length > 0) {
//         // رفع العناصر المحلية للسيرفر
//         for (const item of cartContext.items) {
//           try {
//             await cartAPI.addToCart(item.id, item.cartQuantity);
//           } catch (error) {
//             console.error('Error syncing item to server:', error);
//           }
//         }
        
//         // تنظيف localStorage بعد المزامنة
//         cartContext.clearCart();
        
//         // تحديث السلة من السيرفر
//         await cartAPI.fetchCart();
//       }
//     };

//     syncCartWithServer();
//   }, [sessionId]);

//   // إرجاع API المناسب حسب حالة تسجيل الدخول
//   if (sessionId) {
//     // مستخدم مسجل - استخدم API
//     return {
//       ...cartAPI,
//       // إضافة وظائف Context إذا لزم الأمر
//       toggleCart: cartContext.toggleCart,
//       isOpen: cartContext.isOpen,
//       closeCart: cartContext.closeCart,
//     };
//   } else {
//     // زائر - استخدم localStorage
//     return {
//       ...cartContext,
//       // تحويل البيانات لتتطابق مع API format
//       cartData: {
//         items: cartContext.items.map(item => ({
//           id: item.id,
//           cart_item_id: item.id, // مؤقت
//           name: item.name,
//           price: item.salePrice || item.originalPrice || item.price,
//           quantity: item.cartQuantity,
//           image: item.image,
//           category: item.category,
//         })),
//         subtotal: cartContext.totalPrice,
//         deliveryFee: 0,
//         tax: 0,
//         total: cartContext.totalPrice,
//       },
//       selectedItems: cartContext.items.map(item => item.id),
//       isLoading: false,
//       error: null,
//       // تحويل الوظائف
//       updateQuantity: (itemId: number, quantity: number) => {
//         cartContext.updateQuantity(itemId, quantity);
//       },
//       removeItem: (itemId: number) => {
//         cartContext.removeFromCart(itemId);
//       },
//       removeSelectedItems: () => {
//         cartContext.clearCart();
//       },
//       refreshCartTotal: () => {
//         // لا حاجة للتحديث في localStorage
//       },
//       handleSelectItem: () => {
//         // تنفيذ بسيط
//       },
//       handleSelectAll: () => {
//         // تنفيذ بسيط
//       },
//       handleCheckout: () => {
//         // توجيه لصفحة تسجيل الدخول
//         window.location.href = '/login?redirect=/checkout';
//       },
//       fetchCart: () => Promise.resolve(),
//     };
//   }
// };