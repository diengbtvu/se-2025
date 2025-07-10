"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/adminAPI";

interface User {
  id: number;
  userName: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, loading, user, router]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError(null);
      
      const response = await adminAPI.getUsersPaginated(0, 100); // Lấy tất cả người dùng
      setUsers(response.content || response || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await adminAPI.deleteUser(userToDelete.id);
      
      // Tạm thời chỉ đóng modal và cập nhật UI
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      // TODO: Gọi API cập nhật trạng thái người dùng
      console.log('Cập nhật trạng thái người dùng:', userId);
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      ));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roles = ["all", "ADMIN", "MANAGER", "USER"];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800";
      case "MANAGER": return "bg-purple-100 text-purple-800";
      case "USER": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN": return "Quản trị viên";
      case "MANAGER": return "Quản lý";
      case "USER": return "Người dùng";
      default: return role;
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const adminUsers = users.filter(user => user.role === "ADMIN").length;

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

  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
                Quản lý người dùng
              </h1>
              <p className="text-gray-600">
                Quản lý tài khoản người dùng trong hệ thống
              </p>
            </div>
            <Link
              href="/admin/users/new"
              className="mt-4 md:mt-0 bg-[#65BD60] hover:bg-[#4e9749] text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            >
              <span className="mr-2">➕</span>
              Thêm người dùng mới
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng người dùng</p>
                  <p className="text-xl font-bold text-[#4E4540]">{totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đang hoạt động</p>
                  <p className="text-xl font-bold text-[#4E4540]">{activeUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-red-600">❌</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã khóa</p>
                  <p className="text-xl font-bold text-[#4E4540]">{totalUsers - activeUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">👑</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quản trị viên</p>
                  <p className="text-xl font-bold text-[#4E4540]">{adminUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  placeholder="Tìm theo tên, username hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role === "all" ? "Tất cả" : getRoleText(role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#4E4540]">
                  Danh sách người dùng
                </h2>
                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loadingUsers ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-50 border-b border-red-200">
                <p className="text-red-700">Lỗi: {error}</p>
              </div>
            )}

            {loadingUsers ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
                <p className="mt-4 text-gray-600">Đang tải người dùng...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#65BD60] rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#4E4540]">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{user.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleText(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800' 
                                : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800'
                            }`}
                          >
                            {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/users/${user.id}/edit`}
                              className="text-[#65BD60] hover:text-[#4e9749] transition-colors"
                            >
                              Sửa
                            </Link>
                            {user.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#4E4540] mb-4">
              Xác nhận xóa người dùng
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa người dùng "{userToDelete.name}"? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 