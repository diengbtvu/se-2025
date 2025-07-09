import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '@/services/api';
import { OrdersDTO } from '@/types/api';

interface OrdersState {
  orders: OrdersDTO[];
  loading: boolean;
  error: string | null;
}

export const useOrders = () => {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: false,
    error: null
  });

  const fetchOrders = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const orders = await ordersAPI.getAll();
      setState(prev => ({
        ...prev,
        orders,
        loading: false
      }));
      return { success: true, orders };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch orders' };
    }
  }, []);

  const getOrderById = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const order = await ordersAPI.getById(id);
      setState(prev => ({ ...prev, loading: false }));
      return { success: true, order };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get order' };
    }
  }, []);

  const cancelOrder = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const message = await ordersAPI.cancel(id);
      // Update the order status in the list
      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => 
          order.id === id ? { ...order, status: 'cancelled' } : order
        ),
        loading: false
      }));
      return { success: true, message };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to cancel order' };
    }
  }, []);

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    ...state,
    fetchOrders,
    getOrderById,
    cancelOrder
  };
}; 