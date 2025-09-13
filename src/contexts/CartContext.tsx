// src/contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '@/types/product'; // ✅ استيراد CartItem من product.ts

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

// دالة لحفظ السلة في localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    if (typeof window !== 'undefined') {
      const cartData = {
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      };
      localStorage.setItem('cart', JSON.stringify(cartData));
      console.log('Cart saved to localStorage:', cartData);
    }
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// دالة لتحميل السلة من localStorage
const loadCartFromStorage = (): Partial<CartState> => {
  try {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        // تحويل تواريخ addedAt من string إلى Date
        const items = cartData.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        console.log('Cart loaded from localStorage:', { ...cartData, items });
        return { ...cartData, items };
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return {};
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('Cart action:', action.type, 'payload' in action ? action.payload : 'no payload');
  
  switch (action.type) {
    case 'LOAD_CART': {
      console.log('Loading cart from storage');
      return { ...state, ...action.payload };
    }
    
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      
      // ✅ التحقق 1: إذا المنتج غير متوفر أصلاً
      if (!product.inStock) {
        console.warn(`Product "${product.name}" is out of stock and cannot be added to cart.`);
        return state;
      }

      // ✅ التحقق 2: إذا الكمية المطلوبة أكبر من المخزون
      if (quantity > product.stock) {
        console.warn(`Requested quantity (${quantity}) exceeds available stock (${product.stock}) for product "${product.name}".`);
        return state;
      }

      // ✅ التحقق 3: إذا المنتج موجود بالفعل، تحقق من أن المجموع لا يتجاوز المخزون
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        const totalAfterAdd = existingItem.cartQuantity + quantity;
        if (totalAfterAdd > product.stock) {
          console.warn(`Total quantity after add (${totalAfterAdd}) exceeds available stock (${product.stock}) for product "${product.name}".`);
          return state;
        }
      }

      console.log('Adding to cart:', { product, quantity });
      
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        console.log('Product exists, updating quantity');
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      } else {
        console.log('New product, adding to cart');
        const newItem: CartItem = {
          ...product,
          cartQuantity: quantity,
          addedAt: new Date(),
        };
        newItems = [...state.items, newItem];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.cartQuantity, 0);
      const totalPrice = newItems.reduce((sum, item) => {
        const price = item.salePrice || item.originalPrice || item.price || 0;
        return sum + (price * item.cartQuantity);
      }, 0);
      
      const newState = {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
      
      console.log('New cart state:', newState);
      saveCartToStorage(newState);
      return newState;
    }
    
    case 'REMOVE_FROM_CART': {
      console.log('Removing from cart:', action.payload.productId);
      
      const newItems = state.items.filter(item => item.id !== action.payload.productId);
      const totalItems = newItems.reduce((sum, item) => sum + item.cartQuantity, 0);
      const totalPrice = newItems.reduce((sum, item) => {
        const price = item.salePrice || item.originalPrice || item.price || 0;
        return sum + (price * item.cartQuantity);
      }, 0);
      
      const newState = {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
      
      saveCartToStorage(newState);
      return newState;
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      console.log('Updating quantity:', { productId, quantity });
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }
      
      const existingItem = state.items.find(item => item.id === productId);
      if (existingItem && quantity > existingItem.stock) {
        console.warn(`Quantity ${quantity} exceeds available stock ${existingItem.stock} for product ${existingItem.name}`);
        return state;
      }
      
      const newItems = state.items.map(item =>
        item.id === productId
          ? { ...item, cartQuantity: quantity }
          : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.cartQuantity, 0);
      const totalPrice = newItems.reduce((sum, item) => {
        const price = item.salePrice || item.originalPrice || item.price || 0;
        return sum + (price * item.cartQuantity);
      }, 0);
      
      const newState = {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
      
      saveCartToStorage(newState);
      return newState;
    }
    
    case 'CLEAR_CART':
      console.log('Clearing cart');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
      return initialState;
      
    case 'TOGGLE_CART':
      console.log('Toggling cart');
      return { ...state, isOpen: !state.isOpen };
      
    case 'OPEN_CART':
      console.log('Opening cart');
      return { ...state, isOpen: true };
      
    case 'CLOSE_CART':
      console.log('Closing cart');
      return { ...state, isOpen: false };
      
    default:
      console.log('Unknown action type:', action);
      return state;
  }
};

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isItemInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // تحميل السلة من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (Object.keys(savedCart).length > 0) {
      dispatch({ 
        type: 'LOAD_CART', 
        payload: { ...initialState, ...savedCart } 
      });
    }
  }, []);
  
  const addToCart = (product: Product, quantity: number) => {
    console.log('addToCart function called:', { product, quantity });

    // ✅ التحقق 1: إذا المنتج غير متوفر أصلاً
    if (!product.inStock) {
      console.warn(`Product "${product.name}" is out of stock and cannot be added to cart.`);
      return;
    }

    // ✅ التحقق 2: إذا الكمية المطلوبة أكبر من المخزون
    if (quantity > product.stock) {
      console.warn(`Requested quantity (${quantity}) exceeds available stock (${product.stock}) for product "${product.name}".`);
      return;
    }

    // ✅ التحقق 3: إذا المنتج موجود بالفعل، تحقق من أن المجموع لا يتجاوز المخزون
    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      const totalAfterAdd = existingItem.cartQuantity + quantity;
      if (totalAfterAdd > product.stock) {
        console.warn(`Total quantity after add (${totalAfterAdd}) exceeds available stock (${product.stock}) for product "${product.name}".`);
        return;
      }
    }

    // ✅ إذا اجتاز كل التحققات، أضف للسلة
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };
  
  const removeFromCart = (productId: number) => {
    console.log('removeFromCart function called:', productId);
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    console.log('updateQuantity function called:', { productId, quantity });
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const clearCart = () => {
    console.log('clearCart function called');
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const toggleCart = () => {
    console.log('toggleCart function called');
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  const openCart = () => {
    console.log('openCart function called');
    dispatch({ type: 'OPEN_CART' });
  };
  
  const closeCart = () => {
    console.log('closeCart function called');
    dispatch({ type: 'CLOSE_CART' });
  };
  
  const isItemInCart = (productId: number) => {
    const result = state.items.some(item => item.id === productId);
    console.log(`isItemInCart(${productId}):`, result);
    return result;
  };
  
  const getItemQuantity = (productId: number) => {
    const item = state.items.find(item => item.id === productId);
    const quantity = item ? item.cartQuantity : 0;
    console.log(`getItemQuantity(${productId}):`, quantity);
    return quantity;
  };
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        isItemInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Hook مخصص لإظهار توست الإضافة للسلة
export const useCartNotifications = () => {
  const showAddToCartSuccess = (productName: string, quantity: number) => {
    console.log(`تم إضافة ${quantity} من ${productName} إلى السلة`);
  };
  
  const showRemoveFromCartSuccess = (productName: string) => {
    console.log(`تم حذف ${productName} من السلة`);
  };
  
  return {
    showAddToCartSuccess,
    showRemoveFromCartSuccess,
  };
};