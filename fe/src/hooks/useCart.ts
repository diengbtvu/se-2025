import { useState, useEffect, useCallback, useRef } from 'react';
import { cartAPI } from '@/services/api';
import { CartDTO, CartItem } from '@/types/api';

interface CartState {
  cart: CartDTO | null;
  loading: boolean;
  error: string | null;
}

export const useCart = () => {
  const [cartState, setCartState] = useState<CartState>({
    cart: null,
    loading: false,
    error: null
  });

  const fetchCartRef = useRef<() => Promise<CartDTO>>();

  // Fetch cart on mount
  useEffect(() => {
    // Wait for fetchCart to be available
    const timer = setTimeout(() => {
      fetchCartRef.current?.().catch(() => {
        // Silently fail on mount - user might not be authenticated
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Listen for auth state changes to fetch cart when user logs in
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      if (event.detail?.isAuthenticated) {
        // User logged in, fetch cart
        fetchCartRef.current?.().catch(() => {
          // Silently fail - cart might be empty
        });
      } else {
        // User logged out, clear cart
        setCartState({
          cart: null,
          loading: false,
          error: null
        });
      }
    };

    window.addEventListener('authStateChanged', handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange as EventListener);
    };
  }, []);

  const fetchCart = useCallback(async () => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const cart = await cartAPI.getCart();
      setCartState({
        cart,
        loading: false,
        error: null
      });
      return cart;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
      
      // Don't set error state for authentication errors (user might be logging out)
      if (errorMessage.includes('Token không hợp lệ') || errorMessage.includes('Unauthorized')) {
        setCartState({
          cart: null,
          loading: false,
          error: null
        });
      } else {
        setCartState({
          cart: null,
          loading: false,
          error: errorMessage
        });
      }
      throw error;
    }
  }, []);

  // Update ref when fetchCart changes
  useEffect(() => {
    fetchCartRef.current = fetchCart;
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedCart = await cartAPI.addItem(productId, quantity);
      setCartState({
        cart: updatedCart,
        loading: false,
        error: null
      });
      return updatedCart;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      setCartState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateCartItem = useCallback(async (productId: number, quantity: number) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedCart = await cartAPI.updateItem(productId, quantity);
      setCartState({
        cart: updatedCart,
        loading: false,
        error: null
      });
      return updatedCart;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
      setCartState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const removeFromCart = useCallback(async (productId: number) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await cartAPI.removeItem(productId);
      // Refresh cart after removal
      await fetchCartRef.current?.();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      setCartState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const checkout = useCallback(async (checkoutData: {
    status: string;
    note?: string;
    selectedCartItemIds: number[];
  }) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('Checkout with data:', checkoutData);
      const order = await cartAPI.checkout(checkoutData);
      console.log('Checkout successful:', order);
      
        // Clear cart after successful checkout
      setCartState({
        cart: null,
        loading: false,
        error: null
      });
      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to checkout';
      setCartState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // Helper function to checkout all items in cart
  const checkoutAll = useCallback(async (note?: string) => {
    // Fetch latest cart data before checkout
    const latestCart = await fetchCart();
    
    if (!latestCart || !latestCart.cartItems || latestCart.cartItems.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    const selectedCartItemIds = latestCart.cartItems.map(item => item.id);
    
    return checkout({
      status: 'pending',
      note: note || '',
      selectedCartItemIds
    });
  }, [checkout, fetchCart]);

  const clearError = useCallback(() => {
    setCartState(prev => ({ ...prev, error: null }));
  }, []);

  const clearCart = useCallback(async () => {
    if (!cartState.cart || !cartState.cart.cartItems || cartState.cart.cartItems.length === 0) {
      return;
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Use the clear cart API endpoint
      await cartAPI.clearCart();
      
      // Clear cart state
      setCartState({
        cart: null,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      setCartState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [cartState.cart]);

  const getTotalItems = useCallback(() => {
    if (!cartState.cart || !cartState.cart.cartItems) {
      return 0;
    }
    return cartState.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartState.cart]);

  return {
    ...cartState,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    checkoutAll,
    clearError,
    clearCart,
    getTotalItems
  };
}; 