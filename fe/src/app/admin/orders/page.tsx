"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/adminAPI";
import OrderStatistics from "@/components/admin/OrderStatistics";

interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string | null;
  note?: string;
  total: number;
  orderItems: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<number | null>(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [orderToUpdateStatus, setOrderToUpdateStatus] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

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
      
      const response = await adminAPI.getOrdersPaginated(0, 50); // Lấy 50 đơn hàng
      
      // Xử lý response có thể có cấu trúc khác nhau
      let ordersData = [];
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          ordersData = response;
        } else if (response.content && Array.isArray(response.content)) {
          ordersData = response.content;
        } else if (response.orders && Array.isArray(response.orders)) {
          ordersData = response.orders;
        } else {
          console.warn('Response không có cấu trúc mong đợi:', response);
          ordersData = [];
        }
      }
      
      console.log('Dữ liệu orders nhận được:', ordersData);
      console.log('Orders có ID:', ordersData.map((order: any) => ({ id: order.id, customerName: order.customerName })));
      
      setOrders(ordersData);
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
      // Kiểm tra orderId có hợp lệ không
      if (!orderId || orderId === undefined || orderId === null) {
        console.error('OrderId không hợp lệ:', orderId);
        alert('Lỗi: ID đơn hàng không hợp lệ');
        return;
      }

      console.log('Cập nhật trạng thái đơn hàng:', { orderId, newStatus });
      
      setStatusUpdateLoading(orderId);
      
      // Tạo note tự động dựa trên trạng thái
      const statusNotes = {
        'PENDING': 'Đơn hàng đang chờ xác nhận',
        'PROCESSING': 'Đơn hàng đã được xác nhận và đang xử lý',
        'SHIPPED': 'Đơn hàng đã được giao cho đơn vị vận chuyển',
        'DELIVERED': 'Đơn hàng đã được giao thành công',
        'CANCELLED': 'Đơn hàng đã bị hủy'
      };
      
      const note = statusNotes[newStatus as keyof typeof statusNotes] || `Trạng thái đã được cập nhật thành ${newStatus}`;
      
      await adminAPI.updateOrderStatus(orderId, newStatus, note);
      
      // Refresh danh sách
      fetchOrders();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleUpdateStatusClick = (order: Order) => {
    setOrderToUpdateStatus(order);
    setNewStatus(order.status);
    setStatusNote("");
    setShowStatusUpdateModal(true);
  };

  const handleStatusUpdateConfirm = async () => {
    if (!orderToUpdateStatus) return;
    
    try {
      setStatusUpdateLoading(orderToUpdateStatus.orderId);
      
      await adminAPI.updateOrderStatus(orderToUpdateStatus.orderId, newStatus, statusNote);
      
      setShowStatusUpdateModal(false);
      setOrderToUpdateStatus(null);
      setNewStatus("");
      setStatusNote("");
      
      // Refresh danh sách
      fetchOrders();
      
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    
    setDeleteLoading(true);
    try {
      await adminAPI.deleteOrderWithConstraints(orderToDelete.orderId);
      
      setShowDeleteModal(false);
      setOrderToDelete(null);
      
      // Refresh danh sách
      fetchOrders();
      
      alert('Xóa đơn hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      alert('Có lỗi xảy ra khi xóa đơn hàng: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Chỉ lọc những order có orderId hợp lệ
    if (!order.orderId || order.orderId === undefined || order.orderId === null) {
      console.warn('Order không có orderId hợp lệ:', order);
      return false;
    }
    const matchesSearch = (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

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

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
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
              <div>
                <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
                  Quản lý đơn hàng
                </h1>
                <p className="text-gray-600">
                  Xem và xử lý đơn hàng từ khách hàng
                </p>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="mb-8">
            <OrderStatistics />
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
                  {statuses.map((status, index) => (
                    <option key={`status-${status}-${index}`} value={status}>
                      {status === "all" ? "Tất cả" : getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Danh sách đơn hàng dạng bảng */}
          <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên khách</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-8 text-gray-400">Không có đơn hàng nào</td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono">{order.orderId}</td>
                        <td className="px-4 py-2">{order.customerName}</td>
                        <td className="px-4 py-2">{order.customerPhone}</td>
                        <td className="px-4 py-2">{order.customerEmail}</td>
                        <td className="px-4 py-2">{order.customerAddress || <span className="italic text-gray-400">(trống)</span>}</td>
                        <td className="px-4 py-2">{new Date(order.orderDate).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-green-700 font-bold">{order.total.toLocaleString()}₫</td>
                        <td className="px-4 py-2">{order.note || ''}</td>
                        <td className="px-4 py-2">
                          <ul className="list-disc pl-4 text-xs">
                            {order.orderItems.map(item => (
                              <li key={item.productId}>
                                <span className="font-semibold">{item.productName}</span> x{item.quantity} - {item.price.toLocaleString()}₫ (Tổng: {item.total.toLocaleString()}₫)
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateStatusClick(order)}
                              disabled={statusUpdateLoading === order.orderId}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition-all disabled:opacity-50"
                            >
                              {statusUpdateLoading === order.orderId ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                              <button
                              onClick={() => handleDeleteClick(order)}
                              disabled={deleteLoading}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition-all disabled:opacity-50"
                            >
                              {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#4E4540]">
                Chi tiết đơn hàng #{selectedOrder.orderId}
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
                {[
                  {
                    key: 'customer',
                    label: 'Khách hàng',
                    value: selectedOrder.customerName,
                    span: 1
                  },
                  {
                    key: 'order-date',
                    label: 'Ngày đặt',
                    value: new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN'),
                    span: 1
                  },
                  {
                    key: 'address',
                    label: 'Địa chỉ giao hàng',
                    value: selectedOrder.customerAddress,
                    span: 2
                  },
                  ...(selectedOrder.note ? [{
                    key: 'note',
                    label: 'Ghi chú',
                    value: selectedOrder.note,
                    span: 2
                  }] : [])
                ].map((field, index) => (
                  <div key={`field-${field.key}-${index}`} className={`col-span-${field.span}`}>
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <p className="text-sm text-[#4E4540]">{field.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm đã đặt</label>
                <div className="border rounded-lg">
                  {selectedOrder.orderItems?.map((item: any, index: number) => (
                    <div key={`order-item-${item.productId || index}-${index}`} className="p-3 border-b last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-[#4E4540]">{item.productName}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-[#4E4540]">
                          {((item.price || 0) * (item.quantity || 0)).toLocaleString()} VNĐ
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
                    {(selectedOrder.total || 0).toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#4E4540]">
                Xác nhận xóa đơn hàng
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa đơn hàng <strong>#{orderToDelete.orderId}</strong> của khách hàng <strong>{orderToDelete.customerName}</strong>?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <p className="text-sm text-red-700">
                    Hành động này không thể hoàn tác. Tất cả thông tin đơn hàng sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                {[
                  {
                    key: 'cancel',
                    label: 'Hủy',
                    onClick: () => {
                      setShowDeleteModal(false);
                      setOrderToDelete(null);
                    },
                    className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors',
                    disabled: deleteLoading,
                    loading: false
                  },
                  {
                    key: 'confirm',
                    label: 'Xóa đơn hàng',
                    onClick: handleDeleteConfirm,
                    className: 'flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50',
                    disabled: deleteLoading,
                    loading: deleteLoading
                  }
                ].map((button, index) => (
                  <button
                    key={`modal-button-${button.key}-${index}`}
                    onClick={button.onClick}
                    className={button.className}
                    disabled={button.disabled}
                  >
                    {button.loading ? (
                      <div className="flex items-center justify-center">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang xóa...
                      </div>
                    ) : (
                      button.label
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusUpdateModal && orderToUpdateStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#4E4540]">
                Cập nhật trạng thái đơn hàng #{orderToUpdateStatus.orderId}
              </h3>
              <button
                onClick={() => {
                  setShowStatusUpdateModal(false);
                  setOrderToUpdateStatus(null);
                  setNewStatus("");
                  setStatusNote("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65BD60]"
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPED">Đã giao shipper</option>
                  <option value="DELIVERED">Đã giao hàng</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Nhập ghi chú cho việc cập nhật trạng thái..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65BD60] h-20"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowStatusUpdateModal(false);
                    setOrderToUpdateStatus(null);
                    setNewStatus("");
                    setStatusNote("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleStatusUpdateConfirm}
                  disabled={statusUpdateLoading === orderToUpdateStatus.orderId}
                  className="bg-[#65BD60] hover:bg-[#4000000000749] text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {statusUpdateLoading === orderToUpdateStatus.orderId ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 