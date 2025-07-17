"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/adminAPI";

interface Order {
  id: number;
  orderDate: string;
  status: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  note?: string;
  totalAmount: number;
  itemCount: number;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function OrderDetail() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    status: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    note: ""
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, loading, user, router, orderId]);

  const fetchOrder = async () => {
    try {
      setLoadingOrder(true);
      setError(null);
      
      const orderData = await adminAPI.getOrderById(parseInt(orderId));
      setOrder(orderData);
      
      // Initialize form data
      setFormData({
        status: orderData.status,
        customerName: orderData.customerName,
        customerAddress: orderData.customerAddress,
        customerPhone: orderData.customerPhone || "",
        customerEmail: orderData.customerEmail || "",
        note: orderData.note || ""
      });
    } catch (error) {
      console.error('Lỗi khi tải thông tin đơn hàng:', error);
      setError('Không thể tải thông tin đơn hàng');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleSave = async () => {
    if (!order) return;

    try {
      setSaving(true);
      
      // Update order status
      await adminAPI.updateOrderStatus(order.id, formData.status, formData.note);
      
      // Update order details (if backend supports it)
      // For now, we'll just update the status and note
      
      setEditing(false);
      fetchOrder(); // Refresh data
      
      alert('Cập nhật đơn hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật đơn hàng:', error);
      alert('Có lỗi xảy ra khi cập nhật đơn hàng');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (order) {
      setFormData({
        status: order.status,
        customerName: order.customerName,
        customerAddress: order.customerAddress,
        customerPhone: order.customerPhone || "",
        customerEmail: order.customerEmail || "",
        note: order.note || ""
      });
    }
    setEditing(false);
  };

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

  const statuses = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];

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

  if (loadingOrder) {
    return (
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
              <Link
                href="/admin/orders"
                className="px-4 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors"
              >
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Link
                  href="/admin/orders"
                  className="text-[#65BD60] hover:text-[#4e9749] mr-2"
                >
                  ← Quay lại
                </Link>
                <h1 className="text-4xl font-bold text-[#4E4540]">
                  Đơn hàng #{order.id}
                </h1>
              </div>
              <p className="text-gray-600">
                Chi tiết và quản lý đơn hàng
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#4E4540] mb-4">Trạng thái đơn hàng</h2>
                {editing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {getStatusText(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className={`text-sm font-semibold rounded-full px-3 py-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#4E4540] mb-4">Thông tin khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên khách hàng
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-[#4E4540]">{order.customerName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-[#4E4540]">{order.customerPhone || 'Chưa có'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-[#4E4540]">{order.customerEmail || 'Chưa có'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ giao hàng
                    </label>
                    {editing ? (
                      <textarea
                        value={formData.customerAddress}
                        onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-[#4E4540]">{order.customerAddress}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#4E4540] mb-4">Sản phẩm đã đặt</h2>
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-gray-500">📦</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#4E4540]">{item.productName}</h3>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity || 0} x {(item.price || 0).toLocaleString()} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#4E4540]">
                          {(item.subtotal || 0).toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#4E4540] mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-medium">
                      {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số sản phẩm:</span>
                    <span className="font-medium">{order.itemCount}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-[#4E4540]">Tổng cộng:</span>
                      <span className="text-lg font-bold text-[#4E4540]">
                        {(order.totalAmount || 0).toLocaleString()} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#4E4540] mb-4">Ghi chú</h2>
                {editing ? (
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={4}
                    placeholder="Thêm ghi chú cho đơn hàng..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  />
                ) : (
                  <p className="text-[#4E4540]">
                    {order.note || 'Không có ghi chú'}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 