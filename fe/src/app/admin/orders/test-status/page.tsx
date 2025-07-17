"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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

export default function TestOrderStatusPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [note, setNote] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await adminAPI.getOrdersPaginated(0, 50);
      setOrders(response.content || response || []);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const testUpdateStatus = async () => {
    if (!selectedOrder) {
      alert('Vui lòng chọn một đơn hàng để test');
      return;
    }

    setLoadingTest(true);
    try {
      const result = await adminAPI.updateOrderStatus(selectedOrder.id, newStatus, note);
      setTestResult({
        success: true,
        message: result,
        orderId: selectedOrder.id,
        oldStatus: selectedOrder.status,
        newStatus: newStatus,
        note: note
      });
      
      // Refresh danh sách
      fetchOrders();
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        orderId: selectedOrder.id,
        oldStatus: selectedOrder.status,
        newStatus: newStatus,
        note: note
      });
    } finally {
      setLoadingTest(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPED": return "Đã giao shipper";
      case "DELIVERED": return "Đã giao hàng";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p>Vui lòng đăng nhập với tài khoản admin để test API.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">Test API Cập nhật Trạng thái Đơn hàng</h1>
          
          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chọn đơn hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn đơn hàng để test
                </label>
                <select
                  value={selectedOrder?.id || ""}
                  onChange={(e) => {
                    const order = orders.find(o => o.id === parseInt(e.target.value));
                    setSelectedOrder(order || null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                >
                  <option value="">-- Chọn đơn hàng --</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      #{order.id} - {order.customerName} ({getStatusText(order.status)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn trạng thái mới */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú cho việc cập nhật trạng thái..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Nút test */}
            <div className="mt-6">
              <button
                onClick={testUpdateStatus}
                disabled={!selectedOrder || loadingTest}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingTest ? 'Đang test...' : 'Test Cập nhật Trạng thái'}
              </button>
            </div>
          </div>

          {/* Kết quả test */}
          {testResult && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Kết quả Test</h2>
              <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Trạng thái:</strong> {testResult.success ? '✅ Thành công' : '❌ Thất bại'}</p>
                    <p><strong>Đơn hàng ID:</strong> {testResult.orderId}</p>
                    <p><strong>Trạng thái cũ:</strong> {getStatusText(testResult.oldStatus)}</p>
                    <p><strong>Trạng thái mới:</strong> {getStatusText(testResult.newStatus)}</p>
                    <p><strong>Ghi chú:</strong> {testResult.note || 'Không có'}</p>
                  </div>
                  <div>
                    {testResult.success ? (
                      <p className="text-green-700"><strong>Message:</strong> {testResult.message}</p>
                    ) : (
                      <p className="text-red-700"><strong>Error:</strong> {testResult.error}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách đơn hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Danh sách đơn hàng</h2>
              <button
                onClick={fetchOrders}
                disabled={loadingOrders}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {loadingOrders ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>

            {loadingOrders ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
                <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Không có đơn hàng nào</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Khách hàng</th>
                      <th className="px-4 py-2 text-left">Trạng thái</th>
                      <th className="px-4 py-2 text-left">Tổng tiền</th>
                      <th className="px-4 py-2 text-left">Ngày đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">#{order.id}</td>
                        <td className="px-4 py-2">{order.customerName}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-2">{(order.totalAmount || 0).toLocaleString()} VNĐ</td>
                        <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 