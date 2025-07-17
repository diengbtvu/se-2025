'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '@/services/adminAPI';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  newOrdersToday: number;
  newOrdersThisWeek: number;
  newOrdersThisMonth: number;
}

interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
  revenue: number;
}

interface OrderTrendData {
  date: string;
  orders: number;
  revenue: number;
}

interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
  averageOrder: number;
}

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

export const OrderStatistics = () => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusData[]>([]);
  const [orderTrends, setOrderTrends] = useState<OrderTrendData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderStatistics();
  }, []);

  const fetchOrderStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders with pagination (50 orders)
      const allOrders = await adminAPI.getOrdersPaginated(0, 50);
      const orders = Array.isArray(allOrders) ? allOrders : 
                    (allOrders.content ? allOrders.content : 
                    (allOrders.data ? allOrders.data : []));

      // Calculate basic statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate status-based statistics
      const pendingOrders = orders.filter((order: Order) => 
        order.status === 'PENDING' || order.status === 'pending' || order.status === 'string'   ).length;
      const confirmedOrders = orders.filter((order: Order) => order.status === 'PROCESSING').length;
      const shippingOrders = orders.filter((order: Order) => order.status === 'SHIPPED').length;
      const deliveredOrders = orders.filter((order: Order) => order.status === 'DELIVERED').length;
      const cancelledOrders = orders.filter((order: Order) => order.status === 'CANCELLED').length;

      // Calculate new orders by time period
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const newOrdersToday = orders.filter((order: Order) => 
        new Date(order.orderDate) >= startOfDay
      ).length;

      const newOrdersThisWeek = orders.filter((order: Order) => 
        new Date(order.orderDate) >= startOfWeek
      ).length;

      const newOrdersThisMonth = orders.filter((order: Order) => 
        new Date(order.orderDate) >= startOfMonth
      ).length;

      setStats({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingOrders,
        confirmedOrders,
        shippingOrders,
        deliveredOrders,
        cancelledOrders,
        newOrdersToday,
        newOrdersThisWeek,
        newOrdersThisMonth
      });

      // Calculate order status distribution
      const statusData: OrderStatusData[] = [
        {
          status: 'PENDING',
          count: pendingOrders,
          percentage: totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0,
          revenue: orders.filter((order: Order) => 
            order.status === 'PENDING' || order.status === 'pending' || order.status === 'string'   )
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        },
        {
          status: 'PROCESSING',
          count: confirmedOrders,
          percentage: totalOrders > 0 ? (confirmedOrders / totalOrders) * 100 : 0,
          revenue: orders.filter((order: Order) => order.status === 'PROCESSING')
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        },
        {
          status: 'SHIPPED',
          count: shippingOrders,
          percentage: totalOrders > 0 ? (shippingOrders / totalOrders) * 100 : 0,
          revenue: orders.filter((order: Order) => order.status === 'SHIPPED')
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        },
        {
          status: 'DELIVERED',
          count: deliveredOrders,
          percentage: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
          revenue: orders.filter((order: Order) => order.status === 'DELIVERED')
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        },
        {
          status: 'CANCELLED',
          count: cancelledOrders,
          percentage: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
          revenue: orders.filter((order: Order) => order.status === 'CANCELLED')
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        }
      ];
      setOrderStatuses(statusData);

      // Generate order trends (last 7 days)
      const trendData: OrderTrendData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const dayOrders = orders.filter((order: Order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startOfDate && orderDate < endOfDate;
        });
        
        const dayRevenue = dayOrders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
        
        trendData.push({
          date: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
          orders: dayOrders.length,
          revenue: dayRevenue
        });
      }
      setOrderTrends(trendData);

      // Generate revenue data by period
      const revenuePeriods: RevenueData[] = [
        {
          period: 'Hôm nay',
          revenue: orders.filter((order: Order) => new Date(order.orderDate) >= startOfDay)
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0),
          orders: newOrdersToday,
          averageOrder: newOrdersToday > 0 ? 
            orders.filter((order: Order) => new Date(order.orderDate) >= startOfDay)
              .reduce((sum: number, order: Order) => sum + (order.total || 0), 0) / newOrdersToday : 0
        },
        {
          period: 'Tuần này',
          revenue: orders.filter((order: Order) => new Date(order.orderDate) >= startOfWeek)
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0),
          orders: newOrdersThisWeek,
          averageOrder: newOrdersThisWeek > 0 ? 
            orders.filter((order: Order) => new Date(order.orderDate) >= startOfWeek)
              .reduce((sum: number, order: Order) => sum + (order.total || 0), 0) / newOrdersThisWeek : 0
        },
        {
          period: 'Tháng này',
          revenue: orders.filter((order: Order) => new Date(order.orderDate) >= startOfMonth)
            .reduce((sum: number, order: Order) => sum + (order.total || 0), 0),
          orders: newOrdersThisMonth,
          averageOrder: newOrdersThisMonth > 0 ? 
            orders.filter((order: Order) => new Date(order.orderDate) >= startOfMonth)
              .reduce((sum: number, order: Order) => sum + (order.total || 0), 0) / newOrdersThisMonth : 0
        },
        {
          period: 'Tổng cộng',
          revenue: totalRevenue,
          orders: totalOrders,
          averageOrder: averageOrderValue
        }
      ];
      setRevenueData(revenuePeriods);

    } catch (error) {
      console.error('Lỗi khi lấy thống kê đơn hàng:', error);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "pending": return "bg-yellow-500";
      case "string": return "bg-yellow-500";
      case "PROCESSING": return "bg-blue-500";
      case "SHIPPED": return "bg-purple-500";
      case "DELIVERED": return "bg-green-500";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "pending": return "Chờ xác nhận";
      case "string": return "Chờ xác nhận";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPED": return "Đã giao shipper";
      case "DELIVERED": return "Đã giao hàng";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
          <p className="mt-4 text-gray-600">Đang tải thống kê đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchOrderStatistics}
            className="mt-4 px-4 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.totalOrders}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-[#4E4540]">
                {(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Giá trị TB</p>
              <p className="text-2xl font-bold text-[#4E4540]">
                {(stats.averageOrderValue || 0).toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-orange-600 text-xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.pendingOrders}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-indigo-600 text-xl">🚚</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang giao</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.shippingOrders}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-emerald-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã giao</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.deliveredOrders}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã hủy</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.cancelledOrders}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Phân bố trạng thái đơn hàng</h3>
          <div className="space-y-4">
            {orderStatuses.map((status, index) => (
              <div key={`status-${status.status}-${index}`} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(status.status)}`}
                  ></div>
                  <span className="text-sm font-medium text-[#4E4540]">{getStatusText(status.status)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(status.status)}`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {status.count} ({status.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Xu hướng đơn hàng (7 ngày qua)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {orderTrends.map((data, index) => {
              const maxOrders = orderTrends.length > 0 ? Math.max(...orderTrends.map(d => d.orders || 0)) : 0;
              const height = maxOrders > 0 ? ((data.orders || 0) / maxOrders) * 100 : 0;
              
              return (
                <div key={`trend-${data.date}-${index}`} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#65BD60] to-[#4e9749] rounded-t-lg transition-all duration-500 hover:from-[#4e9749] hover:to-[#65BD60]"
                      style={{
                        height: `${height}%`,
                        minHeight: '4px'
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.orders} đơn hàng
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">{data.date}</p>
                  <p className="text-xs font-bold text-[#4E4540] mt-1">{data.orders || 0}</p>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>{orderTrends.length > 0 ? Math.max(...orderTrends.map(d => d.orders || 0)) : 0}</span>
          </div>
        </motion.div>
      </div>

      {/* Revenue Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Phân tích doanh thu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueData.map((data, index) => (
            <div key={`revenue-${data.period}-${index}`} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#4E4540] mb-2">{data.period}</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Doanh thu: <span className="font-medium text-[#4E4540]">
                    {(data.revenue / 1000000).toFixed(1)}M VNĐ
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Đơn hàng: <span className="font-medium text-[#4E4540]">{data.orders}</span>
                </p>
                <p className="text-sm text-gray-600">
                  TB/đơn: <span className="font-medium text-[#4E4540]">
                    {(data.averageOrder || 0).toLocaleString()} VNĐ
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchOrderStatistics}
          className="px-6 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors font-medium"
        >
          🔄 Làm mới thống kê
        </button>
      </div>
    </div>
  );
};

export default OrderStatistics; 