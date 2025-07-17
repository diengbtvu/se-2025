import { useState, useCallback } from 'react';
import { ordersAPI } from '@/services/api';
import { isLoggedIn, safeApiCall } from '@/utils/authUtils';

export const useBuyNow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyNow = useCallback(async (productId: number, quantity: number, note?: string) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLoggedIn()) {
      const errorMsg = 'Vui lòng đăng nhập để mua hàng';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      const result = await safeApiCall(
        async () => {
          return await ordersAPI.buyNow(productId, quantity, note);
        },
        (error) => {
          console.warn('Lỗi authentication khi mua hàng:', error.message);
        }
      );

      if (result) {
        return result;
      } else {
        const errorMsg = 'Người dùng chưa đăng nhập';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi mua hàng';
      
      // Kiểm tra xem có phải lỗi authentication không
      if (errorMessage.includes('Token không hợp lệ') || 
          errorMessage.includes('Unauthorized') || 
          errorMessage.includes('401')) {
        const authError = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
        setError(authError);
        throw new Error(authError);
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    buyNow,
    loading,
    error,
    clearError
  };
}; 