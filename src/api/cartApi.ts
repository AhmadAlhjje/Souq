// api/cartApi.ts
import { APICartResponse } from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';

export class CartAPI {
  /**
   * Get or create cart - استخدام POST كما هو مطلوب
   */
  static async getOrCreateCart(sessionId: string): Promise<APICartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/get-or-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        session_id: sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Add item to cart
   */
  static async addItem(sessionId: string, productId: number, quantity: number = 1) {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        session_id: sessionId,
        product_id: productId,
        quantity: quantity
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'فشل في إضافة المنتج للسلة'}`);
    }

    return response.json();
  }

  /**
   * Update item quantity
   */
  static async updateItem(sessionId: string, cartItemId: number, quantity: number) {
    const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        quantity: quantity
      }),
    });

    if (!response.ok) {
      throw new Error('فشل في تحديث الكمية');
    }

    return response.json();
  }

  /**
   * Remove single item from cart
   */
  static async removeItem(sessionId: string, cartItemId: number) {
    const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      throw new Error('فشل في حذف المنتج');
    }
    return response.json();
  }

  /**
   * Get cart total
   */
  static async getCartTotal(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/cart/total?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      throw new Error('فشل في حساب إجمالي السلة');
    }

    return response.json();
  }

  /**
   * Clear entire cart
   */
  static async clearCart(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        session_id: sessionId
      }),
    });

    if (!response.ok) {
      throw new Error('فشل في تفريغ السلة');
    }

    return response.json();
  }
}