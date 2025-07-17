'use client';

import { useState } from 'react';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (forceDelete: boolean) => void;
  productName: string;
  productId: number;
  constraints?: {
    cartItems: number;
    orderItems: number;
    totalOrders: number;
  };
  loading?: boolean;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productId,
  constraints,
  loading = false
}: DeleteProductModalProps) {
  const [forceDelete, setForceDelete] = useState(false);

  if (!isOpen) return null;

  const hasConstraints = constraints && (constraints.cartItems > 0 || constraints.orderItems > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Xóa sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Bạn có chắc chắn muốn xóa sản phẩm <strong>"{productName}"</strong> (ID: {productId})?
          </p>
          
          {hasConstraints && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-800 font-medium">Có ràng buộc dữ liệu</span>
              </div>
              <div className="text-sm text-yellow-700 space-y-1">
                {constraints.cartItems > 0 && (
                  <p>• {constraints.cartItems} mục trong giỏ hàng</p>
                )}
                {constraints.orderItems > 0 && (
                  <p>• {constraints.orderItems} mục trong {constraints.totalOrders} đơn hàng</p>
                )}
              </div>
            </div>
          )}

          {hasConstraints && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={forceDelete}
                  onChange={(e) => setForceDelete(e.target.checked)}
                  className="rounded border-gray-300 text-[#65BD60] focus:ring-[#65BD60]"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Xóa tất cả dữ liệu liên quan (giỏ hàng, đơn hàng)
                </span>
              </label>
            </div>
          )}

          {!hasConstraints && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium">Không có ràng buộc dữ liệu</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(forceDelete)}
            disabled={loading || (hasConstraints && !forceDelete)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
} 