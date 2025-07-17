'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '@/services/adminAPI';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  regularUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
}

interface UserActivityData {
  date: string;
  activeUsers: number;
}

interface UserRoleData {
  role: string;
  count: number;
  percentage: number;
}

interface UserStatusData {
  status: string;
  count: number;
  percentage: number;
}

export const UserStatistics = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivityData[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleData[]>([]);
  const [userStatuses, setUserStatuses] = useState<UserStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStatistics();
  }, []);

  const fetchUserStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const dashboardData = await adminAPI.getDashboardStats();
      
      // Fetch active users
      const activeUsersData = await adminAPI.getActiveUsers();
      
      // Fetch all users for detailed analysis
      const allUsers = await adminAPI.getAllUsers();

      // Calculate user statistics
      const totalUsers = allUsers.length;
      const adminUsers = allUsers.filter((user: any) => user.role === 'ADMIN').length;
      const regularUsers = totalUsers - adminUsers;
      const activeUsers = activeUsersData.activeUsersCount || 0;

      // Calculate new users this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newUsersThisMonth = allUsers.filter((user: any) => {
        const userDate = new Date(user.createdAt);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length;

      // Calculate growth rate (mock data for now)
      const userGrowthRate = ((newUsersThisMonth / totalUsers) * 100).toFixed(1);

      setStats({
        totalUsers,
        activeUsers,
        adminUsers,
        regularUsers,
        newUsersThisMonth,
        userGrowthRate: parseFloat(userGrowthRate)
      });

      // Generate user activity data (last 7 days)
      const activityData: UserActivityData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        activityData.push({
          date: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
          activeUsers: Math.floor(Math.random() * 20) + 5 // Mock data
        });
      }
      setUserActivity(activityData);

      // Calculate user roles distribution
      const roleData: UserRoleData[] = [
        {
          role: 'Admin',
          count: adminUsers,
          percentage: totalUsers > 0 ? (adminUsers / totalUsers) * 100 : 0
        },
        {
          role: 'User',
          count: regularUsers,
          percentage: totalUsers > 0 ? (regularUsers / totalUsers) * 100 : 0
        }
      ];
      setUserRoles(roleData);

      // Calculate user status distribution
      const activeStatusUsers = allUsers.filter((user: any) => user.isActive).length;
      const inactiveStatusUsers = totalUsers - activeStatusUsers;
      
      const statusData: UserStatusData[] = [
        {
          status: 'Hoạt động',
          count: activeStatusUsers,
          percentage: totalUsers > 0 ? (activeStatusUsers / totalUsers) * 100 : 0
        },
        {
          status: 'Không hoạt động',
          count: inactiveStatusUsers,
          percentage: totalUsers > 0 ? (inactiveStatusUsers / totalUsers) * 100 : 0
        }
      ];
      setUserStatuses(statusData);

    } catch (error) {
      console.error('Lỗi khi lấy thống kê người dùng:', error);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
          <p className="mt-4 text-gray-600">Đang tải thống kê...</p>
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
            onClick={fetchUserStatistics}
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
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.totalUsers}</p>
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
              <span className="text-green-600 text-xl">🟢</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.activeUsers}</p>
              <p className="text-xs text-gray-500">24h qua</p>
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
              <span className="text-purple-600 text-xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tăng trưởng</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.userGrowthRate}%</p>
              <p className="text-xs text-gray-500">Tháng này</p>
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
              <span className="text-orange-600 text-xl">🆕</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Người dùng mới</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.newUsersThisMonth}</p>
              <p className="text-xs text-gray-500">Tháng này</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Histogram */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Hoạt động người dùng (7 ngày qua)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {userActivity.map((data, index) => {
              const maxValue = stats.totalUsers;
              const height = maxValue > 0 ? (data.activeUsers / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
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
                        {data.activeUsers} người dùng
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">{data.date}</p>
                  <p className="text-xs font-bold text-[#4E4540] mt-1">{data.activeUsers}</p>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>{stats.totalUsers}</span>
          </div>
        </motion.div>

        {/* User Roles Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Phân bố vai trò</h3>
          <div className="space-y-4">
            {userRoles.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-3 ${
                      role.role === 'Admin' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-[#4E4540]">{role.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        role.role === 'Admin' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${role.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {role.count} ({role.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Trạng thái người dùng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {userStatuses.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-3 ${
                      status.status === 'Hoạt động' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-[#4E4540]">{status.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status.status === 'Hoạt động' ? 'bg-green-500' : 'bg-red-500'
                      }`}
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
          
          {/* Pie Chart Visualization */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                {userStatuses.map((status, index) => {
                  const total = userStatuses.reduce((sum, s) => sum + s.count, 0);
                  const percentage = total > 0 ? status.count / total : 0;
                  const circumference = 2 * Math.PI * 56;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (percentage * circumference);
                  const previousPercentages = userStatuses
                    .slice(0, index)
                    .reduce((sum, s) => sum + (s.count / total), 0);
                  const rotation = previousPercentages * 360;

                  return (
                    <circle
                      key={index}
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform={`rotate(${rotation} 64 64)`}
                      className={
                        status.status === 'Hoạt động' ? 'text-green-500' : 'text-red-500'
                      }
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-[#4E4540]">
                  {stats.totalUsers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchUserStatistics}
          className="px-6 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors font-medium"
        >
          🔄 Làm mới thống kê
        </button>
      </div>
    </div>
  );
};

export default UserStatistics; 