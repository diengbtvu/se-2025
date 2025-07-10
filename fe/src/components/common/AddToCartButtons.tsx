'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ProductDTO } from '@/types/api';
import { ordersAPI } from '@/services/api';

interface AddToCartButtonsProps {
  product: ProductDTO;
  quantity?: number;
  className?: string;
}

export default function AddToCartButtons({ 
  product, 
  quantity = 1, 
  className = '' 
}: AddToCartButtonsProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra xem sản phẩm có còn hàng không
  const isOutOfStock = !product.stockQuantity || product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity && product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!product.id) {
      setError('Sản phẩm không hợp lệ');
      return;
    }

    if (isOutOfStock) {
      setError('Sản phẩm đã hết hàng');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addToCart(product.id, quantity);
      alert('Đã thêm vào giỏ hàng thành công!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng';
      setError(errorMessage);
      console.error('Add to cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!product.id) {
      setError('Sản phẩm không hợp lệ');
      return;
    }

    if (isOutOfStock) {
      setError('Sản phẩm đã hết hàng');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Tạo đơn hàng trực tiếp bằng API createOrder
      const order = await ordersAPI.createOrder({
        status: 'pending',
        note: '',
        orderItems: [
          {
            productId: product.id,
            quantity: quantity,
            price: product.price || 0
          }
        ]
      });
      
      alert('Đặt hàng thành công!');
      
      // Chuyển đến trang chi tiết đơn hàng
      router.push(`/orders/${order.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể đặt hàng';
      setError(errorMessage);
      console.error('Buy now error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stock Status */}
      {isOutOfStock && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
          ⚠️ Sản phẩm đã hết hàng
        </div>
      )}
      
      {isLowStock && !isOutOfStock && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm">
          ⚠️ Chỉ còn {product.stockQuantity} sản phẩm trong kho
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Nút Thêm vào giỏ hàng */}
        <button
          onClick={handleAddToCart}
          disabled={loading || isOutOfStock}
          className="flex-1 bg-white border-2 border-[#65BD60] text-[#65BD60] hover:bg-[#65BD60] hover:text-white transition-colors duration-200 py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </div>
          ) : isOutOfStock ? (
            'Hết hàng'
          ) : (
            'Thêm vào giỏ hàng'
          )}
        </button>

        {/* Nút Mua ngay */}
        <button
          onClick={handleBuyNow}
          disabled={loading || isOutOfStock}
          className="flex-1 bg-[#65BD60] text-white hover:bg-[#4CAF50] transition-colors duration-200 py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </div>
          ) : isOutOfStock ? (
            'Hết hàng'
          ) : (
            'Mua ngay'
          )}
        </button>
      </div>

      {/* Stock Info */}
      {!isOutOfStock && (
        <div className="text-sm text-gray-600 text-center">
          Còn {product.stockQuantity} sản phẩm trong kho
        </div>
      )}
    </div>
  );
} 