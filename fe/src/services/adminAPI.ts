import { API_CONFIG } from "@/config/api";

// Helper function để lấy headers với token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  console.log('Authorization header:', token ? `Bearer ${token}` : 'No token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Admin API Service
export const adminAPI = {
  // Dashboard APIs
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dashboard:', error);
      throw error;
    }
  },

  getActiveUsers: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/active-users`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy số người dùng hoạt động:', error);
      throw error;
    }
  },

  // Users Management APIs
  getUsersPaginated: async (page: number = 0, size: number = 10) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/paginated?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      throw error;
    }
  },

  searchUsers: async (keyword: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      throw error;
    }
  },

  getUserById: async (userId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      throw error;
    }
  },

  // Products Management APIs
  getProductsPaginated: async (page: number = 0, size: number = 10) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  getProduct: async (productId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      throw error;
    }
  },

  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    productType: string;
    manufactureDate: string;
    expiryDate: string;
    stockQuantity: number;
    imageUrl: string;
    category: string;
  }) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      throw error;
    }
  },

  updateProduct: async (productId: number, productData: {
    name: string;
    description: string;
    price: number;
    productType: string;
    manufactureDate: string;
    expiryDate: string;
    stockQuantity: number;
    imageUrl: string;
    category: string;
  }) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw error;
    }
  },

  // Orders Management APIs
  getOrdersPaginated: async (page: number = 0, size: number = 10) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      throw error;
    }
  },

  getOrderById: async (orderId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      throw error;
    }
  },

  getOrdersByStatus: async (status: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/status/${status}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng theo trạng thái:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: number, status: string, note?: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  },

  deleteOrder: async (orderId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      throw error;
    }
  },

  // Revenue Report API
  getRevenueReport: async (fromDate: string, toDate: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/revenue/report?fromDate=${fromDate}&toDate=${toDate}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo doanh thu:', error);
      throw error;
    }
  }
}; 