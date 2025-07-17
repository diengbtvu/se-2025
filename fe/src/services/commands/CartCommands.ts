// Cart Commands - Handle write operations
import { CartDTO } from '@/types/api';
import { API_CONFIG } from '@/config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

export class CartCommands {
  // Add item to cart
  static async addToCart(productId: number, quantity: number): Promise<CartDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Update cart item quantity
  static async updateCartItem(productId: number, quantity: number): Promise<CartDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Remove item from cart
  static async removeFromCart(productId: number): Promise<CartDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Checkout cart
  static async checkoutCart(checkoutData: {
    status: string;
    note?: string;
    selectedCartItemIds: number[];
  }): Promise<any> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Clear all items from cart
  static async clearCart(): Promise<string> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  }
} 