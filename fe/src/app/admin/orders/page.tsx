"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/adminAPI";

interface Order {
  id: number;
  orderDate: string;
  status: string;
  customerName: string;
  customerAddress: string;
  note?: string;
  totalAmount: number;
  itemCount: number;
  orderItems: any[];
}

export default function AdminOrders() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

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
      fetchOrders();
    }
  }, [isAuthenticated, loading, user, router]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError(null);
      
      const response = await adminAPI.getOrdersPaginated(0, 100); // Lấy tất cả đơn hàng
      setOrders(response.content || response || []);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      
      // Refresh danh sách
      fetchOrders();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "SHIPPING": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "CONFIRMED": return "Đã xác nhận";
      case "SHIPPING": return "Đang giao";
      case "DELIVERED": return "Đã giao";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === "PENDING").length;
  const deliveredOrders = orders.filter(order => order.status === "DELIVERED").length;

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600">
              Xem và xử lý đơn hàng từ khách hàng
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                  <p className="text-xl font-bold text-[#4E4540]">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-yellow-600">⏳</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chờ xác nhận</p>
                  <p className="text-xl font-bold text-[#4E4540]">{pendingOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã giao</p>
                  <p className="text-xl font-bold text-[#4E4540]">{deliveredOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">💰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-[#4E4540]">
                    {(totalRevenue / 1000000).toFixed(1)}M VNĐ
                  </p>
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
                  placeholder="Tìm theo tên khách hàng, địa chỉ hoặc mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "Tất cả" : getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#4E4540]">
                  Danh sách đơn hàng
                </h2>
                <button
                  onClick={fetchOrders}
                  disabled={loadingOrders}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loadingOrders ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-50 border-b border-red-200">
                <p className="text-red-700">Lỗi: {error}</p>
              </div>
            )}

            {loadingOrders ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
                <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
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
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#4E4540]">
                            #{order.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.itemCount} sản phẩm
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#4E4540]">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {order.totalAmount.toLocaleString()} VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                          >
                            {statuses.filter(s => s !== "all").map(status => (
                              <option key={status} value={status}>
                                {getStatusText(status)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewOrderDetail(order)}
                              className="text-[#65BD60] hover:text-[#4e9749] transition-colors"
                            >
                              Chi tiết
                            </button>
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Sửa
                            </Link>
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

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#4E4540]">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h3>
              <button
                onClick={() => {
                  setShowOrderDetail(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
                  <p className="text-sm text-[#4E4540]">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày đặt</label>
                  <p className="text-sm text-[#4E4540]">
                    {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
                  <p className="text-sm text-[#4E4540]">{selectedOrder.customerAddress}</p>
                </div>
                {selectedOrder.note && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                    <p className="text-sm text-[#4E4540]">{selectedOrder.note}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm đã đặt</label>
                <div className="border rounded-lg">
                  {selectedOrder.orderItems?.map((item: any, index: number) => (
                    <div key={index} className="p-3 border-b last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-[#4E4540]">{item.productName}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-[#4E4540]">
                          {(item.price * item.quantity).toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#4E4540]">Tổng cộng</span>
                  <span className="text-lg font-bold text-[#4E4540]">
                    {selectedOrder.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 