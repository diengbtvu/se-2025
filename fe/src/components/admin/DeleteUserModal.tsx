'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/adminAPI';

interface User {
  id: number;
  userName: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface DeleteUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: number, forceDelete: boolean) => Promise<void>;
}

interface DeletionConstraints {
  canDelete: boolean;
  constraints: {
    hasOrders: boolean;
    orderCount: number;
    hasCartItems: boolean;
    cartItemCount: number;
    constraintDetails?: string[];
    message?: string;
  };
}

export const DeleteUserModal = ({ user, isOpen, onClose, onDelete }: DeleteUserModalProps) => {
  const [constraints, setConstraints] = useState<DeletionConstraints | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingConstraints, setCheckingConstraints] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      checkConstraints();
    }
  }, [isOpen, user]);

  const checkConstraints = async () => {
    if (!user) return;
    
    setCheckingConstraints(true);
    try {
      const result = await adminAPI.checkUserDeletionConstraints(user.id);
      setConstraints(result);
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc:', error);
      setConstraints({
        canDelete: false,
        constraints: {
          hasOrders: false,
          orderCount: 0,
          hasCartItems: false,
          cartItemCount: 0,
          message: error instanceof Error ? error.message : 'Lỗi không xác định'
        }
      });
    } finally {
      setCheckingConstraints(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await onDelete(user.id, false); // Không bao giờ force delete
      onClose();
    } catch (error) {
      console.error('Lỗi khi xóa user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Xóa người dùng
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
            Bạn có chắc chắn muốn xóa người dùng này?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.userName} ({user.email})</p>
            <p className="text-sm text-gray-600">Vai trò: {user.role}</p>
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
                  Người dùng này không có dữ liệu liên quan nào.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-800 font-medium">Không thể xóa người dùng</p>
                </div>
                
                <div className="space-y-2 text-sm text-red-700">
                  {constraints.constraints.constraintDetails && constraints.constraints.constraintDetails.map((detail, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                      <span>{detail}</span>
                    </div>
                  ))}
                  {constraints.constraints.message && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                      <span>{constraints.constraints.message}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-red-600">
                    ⚠️ Người dùng này có dữ liệu liên quan, không thể xóa. Vui lòng xóa các đơn hàng và giỏ hàng trước.
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
            disabled={loading || (constraints && !constraints.canDelete)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang xóa...
              </div>
            ) : constraints && !constraints.canDelete ? (
              'Không thể xóa'
            ) : (
              'Xóa người dùng'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal; 