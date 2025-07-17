// Cart Queries - Handle read operations
import { CartDTO } from '@/types/api';
import { API_CONFIG } from '@/config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

export class CartQueries {
  // Get user's cart
  static async getCart(): Promise<CartDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get cart item count (for header display)
  static async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalItems || 0;
    } catch (error) {
      // Return 0 if cart is not accessible (user not logged in)
      return 0;
    }
  }

  // Check if cart has items
  static async hasCartItems(): Promise<boolean> {
    try {
      const cart = await this.getCart();
      return cart.cartItems && cart.cartItems.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Get cart total amount
  static async getCartTotal(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalAmount || 0;
    } catch (error) {
      return 0;
    }
  }
} 