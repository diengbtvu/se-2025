"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/adminAPI";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    console.log('Admin page - isAuthenticated:', isAuthenticated);
    console.log('Admin page - user:', user);
    console.log('Admin page - loading:', loading);
    
    if (!isAuthenticated && !loading) {
      console.log('Redirecting to login - not authenticated');
      router.push('/login');
      return;
    }

    // Kiểm tra quyền admin
    if (user && user.role !== 'ADMIN') {
      console.log('Redirecting to home - not admin, role:', user.role);
      router.push('/');
      return;
    }

    if (isAuthenticated) {
      console.log('Fetching dashboard stats...');
      fetchDashboardStats();
    }
  }, [isAuthenticated, loading, user, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      
      // Gọi API để lấy thống kê dashboard
      const dashboardData = await adminAPI.getDashboardStats();
      const activeUsersData = await adminAPI.getActiveUsers();
      
      setStats({
        totalUsers: dashboardData.totalUsers || 0,
        totalProducts: dashboardData.totalProducts || 0,
        totalOrders: dashboardData.totalOrders || 0,
        totalRevenue: dashboardData.totalRevenue || 0,
      });
      
      setLoadingStats(false);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
      // Fallback to sample data if API fails
      setStats({
        totalUsers: 156,
        totalProducts: 24,
        totalOrders: 89,
        totalRevenue: 12500000,
      });
      setLoadingStats(false);
    }
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

  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#4E4540] mb-4">
                  Bảng điều khiển Admin
                </h1>
                <p className="text-gray-600">
                  Quản lý hệ thống BeeLife Ventures
                </p>
              </div>

            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Tổng người dùng",
                value: stats.totalUsers,
                icon: "👥",
                color: "bg-blue-500",
                link: "/admin/users",
              },
              {
                title: "Tổng sản phẩm",
                value: stats.totalProducts,
                icon: "📦",
                color: "bg-green-500",
                link: "/admin/products",
              },
              {
                title: "Tổng đơn hàng",
                value: stats.totalOrders,
                icon: "📋",
                color: "bg-yellow-500",
                link: "/admin/orders",
              },
              {
                title: "Doanh thu",
                value: `${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`,
                icon: "💰",
                color: "bg-purple-500",
                link: "/admin/revenue",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <Link href={stat.link} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-[#4E4540]">
                        {loadingStats ? "..." : stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#4E4540] mb-4">
                Quản lý nhanh
              </h2>
              <div className="space-y-3">
                <Link
                  href="/admin/products/new"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600">➕</span>
                  </div>
                  <span className="text-gray-700">Thêm sản phẩm mới</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600">📋</span>
                  </div>
                  <span className="text-gray-700">Xem đơn hàng mới</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600">👥</span>
                  </div>
                  <span className="text-gray-700">Quản lý người dùng</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#4E4540] mb-4">
                Thống kê gần đây
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đơn hàng hôm nay</span>
                  <span className="font-semibold text-[#4E4540]">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Người dùng mới</span>
                  <span className="font-semibold text-[#4E4540]">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Doanh thu hôm nay</span>
                  <span className="font-semibold text-[#4E4540]">2.5M VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#4E4540] mb-6">
              Menu quản lý
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Quản lý sản phẩm",
                  description: "Thêm, sửa, xóa sản phẩm",
                  icon: "📦",
                  href: "/admin/products",
                  color: "bg-green-100 text-green-600",
                },
                {
                  title: "Quản lý đơn hàng",
                  description: "Xem và xử lý đơn hàng",
                  icon: "📋",
                  href: "/admin/orders",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  title: "Quản lý người dùng",
                  description: "Quản lý tài khoản người dùng",
                  icon: "👥",
                  href: "/admin/users",
                  color: "bg-purple-100 text-purple-600",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-[#65BD60] hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#4E4540] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 