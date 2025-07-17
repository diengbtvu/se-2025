"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Profile() {
  const { isAuthenticated, user, loading, logout, refreshProfile, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
    setUpdateMessage(null);
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    setUpdateMessage(null);

    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setUpdateMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        setIsEditing(false);
      } else {
        setUpdateMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra khi cập nhật' });
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#4E4540] mb-4">
              Thông tin cá nhân
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin tài khoản của bạn
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-[#4E4540]">
                Thông tin cơ bản
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={refreshProfile}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Làm mới
                </button>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            {/* Update Message */}
            {updateMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                updateMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {updateMessage.text}
              </div>
            )}

            {user ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      {user.userName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      {user.role}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                        {user.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                        placeholder="Nhập email"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                        {user.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                        {user.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                        {user.address || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Không thể tải thông tin người dùng</p>
              </div>
            )}

            {/* Edit Actions */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={updateLoading}
                    className="flex-1 bg-[#65BD60] hover:bg-[#4e9749] disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all"
                  >
                    {updateLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={updateLoading}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="flex-1 bg-[#65BD60] hover:bg-[#4e9749] text-white py-3 px-6 rounded-lg font-semibold text-center transition-all"
                >
                  Xem sản phẩm
                </Link>
                <button
                  onClick={logout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
} 