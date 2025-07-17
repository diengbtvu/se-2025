"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_CONFIG } from "@/config/api";
import AuthRequiredMessage from "@/components/common/AuthRequiredMessage";

export default function Orders() {
  const { isAuthenticated, loading } = useAuth();
  const { orders, loading: loadingOrders, error, fetchOrders, cancelOrder } = useOrders();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleViewOrderDetail = async (orderId: number) => {
    try {
      // Gọi API để lấy chi tiết đơn hàng
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải chi tiết đơn hàng');
      }

      const orderDetail = await response.json();
      setSelectedOrder(orderDetail);
      setShowOrderDetail(true);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await cancelOrder(orderId);
      alert('Đơn hàng đã được hủy thành công!');
      fetchOrders(); // Refresh danh sách
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Không thể hủy đơn hàng: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Chờ xử lý';
    }
  };

  // Xử lý ảnh sản phẩm từ server
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl && !imageUrl.startsWith('http')) {
      return `${API_CONFIG.BASE_URL}${imageUrl}`;
    }
    return imageUrl || "/images/honey and hive.webp";
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
    return (
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#4E4540] mb-4">
                Đơn hàng của tôi
              </h1>
              <p className="text-gray-600">
                Theo dõi trạng thái đơn hàng của bạn
              </p>
            </div>
            <AuthRequiredMessage 
              message="Vui lòng đăng nhập để xem đơn hàng của bạn"
              showLoginButton={true}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#4E4540] mb-4">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">
              Theo dõi trạng thái đơn hàng của bạn
            </p>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loadingOrders ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p>Lỗi: {error}</p>
            </div>
          )}

          {loadingOrders && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
              <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
            </div>
          )}

          {!loadingOrders && orders.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75 15zm0 3h.008v.008H6.75 18z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-600 mb-8">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-[#65BD60] hover:bg-[#4e9749] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
                Mua sắm ngay
              </Link>
            </div>
          )}

          {!loadingOrders && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <Link href={`/orders/${order.id}`} key={order.id || `order-${index}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Đơn hàng #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Ngày đặt: {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                          </p>
                          {order.itemCount && (
                            <p className="text-sm text-gray-500">
                              Số sản phẩm: {order.itemCount}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                            {getStatusText(order.status || 'pending')}
                          </span>
                          <span className="text-lg font-semibold text-[#65BD60]">
                            {order.totalAmount?.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 