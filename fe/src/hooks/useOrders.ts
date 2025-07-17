import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '@/services/api';
import { OrdersDTO } from '@/types/api';
import { isLoggedIn, safeApiCall } from '@/utils/authUtils';
import { useAuthStateListener } from './useAuthStateListener';

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

  // Lắng nghe thay đổi trạng thái authentication
  useAuthStateListener({
    onLogin: () => {
      // Khi user đăng nhập, tự động fetch orders
      fetchOrders();
    },
    onLogout: () => {
      // Khi user đăng xuất, clear orders
      setState({
        orders: [],
        loading: false,
        error: null
      });
    }
  });

  const fetchOrders = useCallback(async () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLoggedIn()) {
      console.log('Người dùng chưa đăng nhập, bỏ qua việc lấy danh sách đơn hàng');
      setState(prev => ({ 
        ...prev, 
        orders: [],
        loading: false,
        error: null 
      }));
      return { success: false, error: 'Người dùng chưa đăng nhập' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await safeApiCall(
        async () => {
          return await ordersAPI.getAll();
        },
        (error) => {
          console.warn('Lỗi authentication khi lấy đơn hàng:', error.message);
          // Không set error state cho lỗi authentication
        }
      );

      if (result) {
        setState(prev => ({
          ...prev,
          orders: result,
          loading: false
        }));
        return { success: true, orders: result };
      } else {
        // API call bị skip do không authenticated
        setState(prev => ({
          ...prev,
          orders: [],
          loading: false
        }));
        return { success: false, error: 'Người dùng chưa đăng nhập' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy danh sách đơn hàng';
      
      // Kiểm tra xem có phải lỗi authentication không
      if (errorMessage.includes('Token không hợp lệ') || 
          errorMessage.includes('Unauthorized') || 
          errorMessage.includes('401')) {
        console.warn('Token không hợp lệ, xóa thông tin đăng nhập');
        setState(prev => ({ 
          ...prev, 
          orders: [],
          loading: false,
          error: null // Không hiển thị lỗi cho user
        }));
        return { success: false, error: 'Phiên đăng nhập đã hết hạn' };
      }
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const getOrderById = useCallback(async (id: number) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLoggedIn()) {
      return { success: false, error: 'Người dùng chưa đăng nhập' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await safeApiCall(
        async () => {
          return await ordersAPI.getById(id);
        },
        (error) => {
          console.warn('Lỗi authentication khi lấy đơn hàng:', error.message);
        }
      );

      if (result) {
        setState(prev => ({ ...prev, loading: false }));
        return { success: true, order: result };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: 'Người dùng chưa đăng nhập' };
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Lỗi khi lấy đơn hàng' };
    }
  }, []);

  const cancelOrder = useCallback(async (id: number) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLoggedIn()) {
      return { success: false, error: 'Người dùng chưa đăng nhập' };
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await safeApiCall(
        async () => {
          return await ordersAPI.cancel(id);
        },
        (error) => {
          console.warn('Lỗi authentication khi hủy đơn hàng:', error.message);
        }
      );

      if (result) {
        // Cập nhật trạng thái đơn hàng trong danh sách
        setState(prev => ({
          ...prev,
          orders: prev.orders.map(order => 
            order.id === id ? { ...order, status: 'cancelled' } : order
          ),
          loading: false
        }));
        return { success: true, message: result };
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: 'Người dùng chưa đăng nhập' };
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Lỗi khi hủy đơn hàng' };
    }
  }, []);

  // Chỉ load orders khi component mount nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isLoggedIn()) {
      fetchOrders();
    }
  }, [fetchOrders]);

  return {
    ...state,
    fetchOrders,
    getOrderById,
    cancelOrder
  };
}; 