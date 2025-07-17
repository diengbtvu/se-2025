"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminAPI } from "@/services/adminAPI";

export default function DebugOrdersPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      
      const response = await adminAPI.getOrdersPaginated(0, 50);
      const ordersData = response.content || response || [];
      
      console.log('Raw response:', response);
      console.log('Orders data:', ordersData);
      
      setDebugInfo({
        rawResponse: response,
        ordersData: ordersData,
        ordersCount: ordersData.length,
        ordersWithId: ordersData.filter((order: any) => order.id !== undefined && order.id !== null),
        ordersWithoutId: ordersData.filter((order: any) => order.id === undefined || order.id === null),
        sampleOrder: ordersData[0] || null
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Lỗi không xác định' });
    } finally {
      setLoadingOrders(false);
    }
  };

  const testUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      console.log('Testing update status:', { orderId, newStatus });
      const result = await adminAPI.updateOrderStatus(orderId, newStatus, 'Test note');
      console.log('Update result:', result);
      alert(`Cập nhật thành công: ${result}`);
    } catch (error) {
      console.error('Update error:', error);
      alert(`Lỗi cập nhật: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
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
            <p>Vui lòng đăng nhập với tài khoản admin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">Debug Orders Data</h1>
          
          <div className="mb-6">
            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loadingOrders ? 'Đang tải...' : 'Làm mới dữ liệu'}
            </button>
          </div>

          {/* Debug Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-4">
              <div>
                <strong>Tổng số orders:</strong> {debugInfo.ordersCount || 0}
              </div>
              <div>
                <strong>Orders có ID:</strong> {debugInfo.ordersWithId?.length || 0}
              </div>
              <div>
                <strong>Orders không có ID:</strong> {debugInfo.ordersWithoutId?.length || 0}
              </div>
              {debugInfo.sampleOrder && (
                <div>
                  <strong>Sample Order:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify(debugInfo.sampleOrder, null, 2)}
                  </pre>
                </div>
              )}
              {debugInfo.error && (
                <div className="text-red-600">
                  <strong>Error:</strong> {debugInfo.error}
                </div>
              )}
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Danh sách Orders</h2>
            
            {loadingOrders ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Không có đơn hàng nào</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <span className={`font-bold ${order.id ? 'text-green-600' : 'text-red-600'}`}>
                            {order.id || 'UNDEFINED'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{order.customerName || 'N/A'}</td>
                        <td className="px-4 py-2">{order.status || 'N/A'}</td>
                        <td className="px-4 py-2">{(order.totalAmount || 0).toLocaleString()} VNĐ</td>
                        <td className="px-4 py-2">
                          {order.id ? (
                            <div className="space-x-2">
                              <button
                                onClick={() => testUpdateStatus(order.id, 'PROCESSING')}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                              >
                                Test PROCESSING
                              </button>
                              <button
                                onClick={() => testUpdateStatus(order.id, 'CANCELLED')}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                              >
                                Test CANCELLED
                              </button>
                            </div>
                          ) : (
                            <span className="text-red-500 text-xs">Không thể test</span>
                          )}
                        </td>
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