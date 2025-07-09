import { useState, useCallback } from 'react';
import { ordersAPI } from '@/services/api';

export const useBuyNow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyNow = useCallback(async (productId: number, quantity: number, note?: string) => {
    setLoading(true);
    setError(null);

    try {
      const order = await ordersAPI.buyNow(productId, quantity, note);
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy now';
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