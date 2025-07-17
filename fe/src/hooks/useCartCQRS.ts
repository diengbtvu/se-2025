// CQRS Pattern Hook for Cart
import { useState, useEffect, useCallback, useRef } from 'react';
import { CartQueries } from '@/services/queries/CartQueries';
import { CartCommands } from '@/services/commands/CartCommands';
import { CartDTO } from '@/types/api';
import { useAuth } from './useAuth';
import { isLoggedIn } from '@/utils/authUtils';

interface CartState {
  cart: CartDTO | null;
  loading: boolean;
  error: string | null;
}

export const useCartCQRS = () => {
  const { isAuthenticated } = useAuth();
  const [cartState, setCartState] = useState<CartState>({
    cart: null,
    loading: false,
    error: null
  });

  const fetchCartRef = useRef<() => Promise<CartDTO>>();

  // QUERY OPERATIONS
  const fetchCart = useCallback(async () => {
    // Don't fetch cart if user is not authenticated
    if (!isLoggedIn()) {
      console.log('User not authenticated, skipping cart fetch');
      return null;
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const cart = await CartQueries.getCart();
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

  const getCartItemCount = useCallback(async () => {
    try {
      return await CartQueries.getCartItemCount();
    } catch (error) {
      return 0;
    }
  }, []);

  const hasCartItems = useCallback(async () => {
    try {
      return await CartQueries.hasCartItems();
    } catch (error) {
      return false;
    }
  }, []);

  const getCartTotal = useCallback(async () => {
    try {
      return await CartQueries.getCartTotal();
    } catch (error) {
      return 0;
    }
  }, []);

  // COMMAND OPERATIONS
  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    // Don't add to cart if user is not authenticated
    if (!isLoggedIn()) {
      throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedCart = await CartCommands.addToCart(productId, quantity);
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
    // Don't update cart if user is not authenticated
    if (!isLoggedIn()) {
      throw new Error('Vui lòng đăng nhập để cập nhật giỏ hàng');
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedCart = await CartCommands.updateCartItem(productId, quantity);
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
    // Don't remove from cart if user is not authenticated
    if (!isLoggedIn()) {
      throw new Error('Vui lòng đăng nhập để xóa khỏi giỏ hàng');
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await CartCommands.removeFromCart(productId);
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
    // Don't checkout if user is not authenticated
    if (!isLoggedIn()) {
      throw new Error('Vui lòng đăng nhập để thanh toán');
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const order = await CartCommands.checkoutCart(checkoutData);
      
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

  const clearCart = useCallback(async () => {
    if (!cartState.cart || !cartState.cart.cartItems || cartState.cart.cartItems.length === 0) {
      return;
    }

    setCartState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const message = await CartCommands.clearCart();
      setCartState({
        cart: null,
        loading: false,
        error: null
      });
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      setCartState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [cartState.cart]);

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

  // Update ref when fetchCart changes
  useEffect(() => {
    fetchCartRef.current = fetchCart;
  }, [fetchCart]);

  // Fetch cart on mount
  useEffect(() => {
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

  const clearError = useCallback(() => {
    setCartState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...cartState,
    
    // Query Operations
    fetchCart,
    getCartItemCount,
    hasCartItems,
    getCartTotal,
    
    // Command Operations
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    checkoutAll,
    clearCart,
    
    // Utility
    clearError
  };
}; 