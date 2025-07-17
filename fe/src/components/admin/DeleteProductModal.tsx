'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/adminAPI';
import { API_CONFIG } from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
}

interface DeleteProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (productId: number, forceDelete: boolean) => Promise<void>;
}

interface ProductConstraints {
  canDelete: boolean;
  constraints: {
    hasOrders: boolean;
    orderCount: number;
    hasCartItems: boolean;
    cartItemCount: number;
    error?: string;
  };
}

export const DeleteProductModal = ({ product, isOpen, onClose, onDelete }: DeleteProductModalProps) => {
  const [constraints, setConstraints] = useState<ProductConstraints | null>(null);
  const [loading, setLoading] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [checkingConstraints, setCheckingConstraints] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      checkConstraints();
    }
  }, [isOpen, product]);

  const checkConstraints = async () => {
    if (!product) return;
    
    setCheckingConstraints(true);
    try {
      // Kiểm tra xem sản phẩm có trong đơn hàng không
      const orders = await adminAPI.getAllOrders();
      const productOrders = orders.content?.filter((order: any) => 
        order.orderItems?.some((item: any) => item.productId === product.id)
      ) || [];
      
      // Kiểm tra xem sản phẩm có trong giỏ hàng không
      const cartItems = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${product.id}/cart-items`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => res.ok ? res.json() : []).catch(() => []);

      setConstraints({
        canDelete: productOrders.length === 0 && cartItems.length === 0,
        constraints: {
          hasOrders: productOrders.length > 0,
          orderCount: productOrders.length,
          hasCartItems: cartItems.length > 0,
          cartItemCount: cartItems.length
        }
      });
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc:', error);
      setConstraints({
        canDelete: false,
        constraints: {
          hasOrders: false,
          orderCount: 0,
          hasCartItems: false,
          cartItemCount: 0,
          error: error instanceof Error ? error.message : 'Lỗi không xác định'
        }
      });
    } finally {
      setCheckingConstraints(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    setLoading(true);
    try {
      await onDelete(product.id, forceDelete);
      onClose();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Xóa sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Bạn có chắc chắn muốn xóa sản phẩm này?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-3">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-gray-600">Giá: {(product.price || 0).toLocaleString('vi-VN')} VNĐ</p>
                <p className="text-sm text-gray-600">Tồn kho: {product.stockQuantity}</p>
              </div>
            </div>
          </div>
        </div>

        {checkingConstraints ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang kiểm tra ràng buộc...</p>
          </div>
        ) : constraints && (
          <div className="mb-4">
            {constraints.canDelete ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">Có thể xóa an toàn</p>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Sản phẩm này không có trong đơn hàng hoặc giỏ hàng nào.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-800 font-medium">Có ràng buộc dữ liệu</p>
                </div>
                
                <div className="space-y-2 text-sm text-yellow-700">
                  {constraints.constraints.hasOrders && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                      <span>Có trong {constraints.constraints.orderCount} đơn hàng</span>
                    </div>
                  )}
                  {constraints.constraints.hasCartItems && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                      <span>Có trong {constraints.constraints.cartItemCount} giỏ hàng</span>
                    </div>
                  )}
                  {constraints.constraints.error && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                      <span>Lỗi: {constraints.constraints.error}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={forceDelete}
                      onChange={(e) => setForceDelete(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-yellow-800 font-medium">
                      Xóa và cập nhật dữ liệu liên quan
                    </span>
                  </label>
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ Hành động này sẽ xóa sản phẩm khỏi các đơn hàng và giỏ hàng.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || (constraints && !constraints.canDelete && !forceDelete)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang xóa...
              </div>
            ) : (
              'Xóa sản phẩm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal; 