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

  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users`, {
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
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      // API trả về text message, không phải JSON
      return await response.text();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      throw error;
    }
  },

  // Products Management APIs - ĐẦY ĐỦ CRUD
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

  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products`, {
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
    productType?: string;
    manufactureDate?: string;
    expiryDate?: string;
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
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      throw error;
    }
  },

  updateProduct: async (productId: number, productData: {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    productType?: string;
    manufactureDate?: string;
    expiryDate?: string;
    stockQuantity?: number;
    imageUrl?: string;
  }) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      throw error;
    }
  },

  // Kiểm tra ràng buộc khi xóa sản phẩm (Frontend logic)
  checkProductDeleteConstraints: async (productId: number) => {
    try {
      // Thử gọi API backend trước
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}/constraints`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        return await response.json();
      } else {
        // Nếu API không tồn tại, sử dụng logic frontend
        console.log('API constraints không tồn tại, sử dụng logic frontend');
        return await adminAPI.checkProductConstraintsFrontend(productId);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc sản phẩm:', error);
      // Sử dụng logic frontend nếu có lỗi
      return await adminAPI.checkProductConstraintsFrontend(productId);
    }
  },

  // Logic kiểm tra ràng buộc ở frontend
  checkProductConstraintsFrontend: async (productId: number) => {
    try {
      // Lấy tất cả cart items và orders để kiểm tra
      const [cartResponse, ordersResponse] = await Promise.allSettled([
        fetch(`${API_CONFIG.BASE_URL}/api/admin/cart-items`, {
          method: 'GET',
          headers: getAuthHeaders()
        }),
        fetch(`${API_CONFIG.BASE_URL}/api/admin/orders`, {
          method: 'GET',
          headers: getAuthHeaders()
        })
      ]);

      let cartItems = 0;
      let orderItems = 0;
      let totalOrders = 0;
      let cartDetails: any[] = [];
      let orderDetails: any[] = [];

      // Kiểm tra cart items
      if (cartResponse.status === 'fulfilled' && cartResponse.value.ok) {
        const cartData = await cartResponse.value.json();
        const cartItemsList = Array.isArray(cartData) ? cartData : 
                             (cartData.content ? cartData.content : 
                             (cartData.data ? cartData.data : []));
        
        const relatedCartItems = cartItemsList.filter((item: any) => item.productId === productId);
        cartItems = relatedCartItems.length;
        cartDetails = relatedCartItems.map((item: any) => ({
          id: item.id,
          cartId: item.cartId,
          userId: item.userId,
          userName: item.userName,
          quantity: item.quantity
        }));
      }

      // Kiểm tra orders
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.ok) {
        const ordersData = await ordersResponse.value.json();
        const ordersList = Array.isArray(ordersData) ? ordersData : 
                          (ordersData.content ? ordersData.content : 
                          (ordersData.data ? ordersData.data : []));
        
        const ordersWithProduct = ordersList.filter((order: any) => 
          order.orderItems && order.orderItems.some((item: any) => item.productId === productId)
        );
        
        totalOrders = ordersWithProduct.length;
        orderDetails = ordersWithProduct.map((order: any) => {
          const relatedItems = order.orderItems.filter((item: any) => item.productId === productId);
          return {
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            status: order.status,
            items: relatedItems.map((item: any) => ({
              id: item.id,
              quantity: item.quantity
            }))
          };
        });
        
        orderItems = orderDetails.reduce((total: number, order: any) => 
          total + order.items.length, 0
        );
      }

      return {
        canDelete: cartItems === 0 && orderItems === 0,
        constraints: {
          cartItems,
          orderItems,
          totalOrders,
          cartDetails,
          orderDetails,
          message: null
        }
      };
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc frontend:', error);
      return {
        canDelete: false,
        constraints: {
          cartItems: 0,
          orderItems: 0,
          totalOrders: 0,
          cartDetails: [],
          orderDetails: [],
          message: 'Không thể kiểm tra ràng buộc'
        }
      };
    }
  },

  // Kiểm tra xem có thể xóa sản phẩm hay không
  canDeleteProduct: async (productId: number) => {
    try {
      const constraints = await adminAPI.checkProductDeleteConstraints(productId);
      return {
        canDelete: constraints.canDelete || (constraints.constraints.cartItems === 0 && constraints.constraints.orderItems === 0),
        constraints: constraints.constraints,
        message: constraints.constraints.message || null
      };
    } catch (error) {
      console.error('Lỗi khi kiểm tra khả năng xóa sản phẩm:', error);
      return {
        canDelete: false,
        constraints: {
          cartItems: 0,
          orderItems: 0,
          totalOrders: 0
        },
        message: 'Không thể kiểm tra khả năng xóa sản phẩm'
      };
    }
  },

  // Xóa sản phẩm với force delete (xóa tất cả dữ liệu liên quan)
  forceDeleteProduct: async (productId: number) => {
    try {
      // Thử gọi API backend trước
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}/force`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        return await response.text();
      } else {
        // Nếu API không tồn tại, sử dụng logic frontend
        console.log('API force delete không tồn tại, sử dụng logic frontend');
        return await adminAPI.forceDeleteProductFrontend(productId);
      }
    } catch (error) {
      console.error('Lỗi khi force delete sản phẩm:', error);
      // Sử dụng logic frontend nếu có lỗi
      return await adminAPI.forceDeleteProductFrontend(productId);
    }
  },

  // Logic force delete ở frontend
  forceDeleteProductFrontend: async (productId: number) => {
    try {
      // Lấy thông tin ràng buộc trước
      const constraints = await adminAPI.checkProductConstraintsFrontend(productId);
      
      // Xóa cart items liên quan
      if (constraints.constraints.cartItems > 0) {
        const cartResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/cart-items`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          const cartItemsList = Array.isArray(cartData) ? cartData : 
                               (cartData.content ? cartData.content : 
                               (cartData.data ? cartData.data : []));
          
          const cartItemsToDelete = cartItemsList.filter((item: any) => item.productId === productId);
          
          // Xóa từng cart item
          for (const item of cartItemsToDelete) {
            await fetch(`${API_CONFIG.BASE_URL}/api/admin/cart-items/${item.id}`, {
              method: 'DELETE',
              headers: getAuthHeaders()
            });
          }
        }
      }

      // Xóa order items liên quan
      if (constraints.constraints.orderItems > 0) {
        const ordersResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          const ordersList = Array.isArray(ordersData) ? ordersData : 
                            (ordersData.content ? ordersData.content : 
                            (ordersData.data ? ordersData.data : []));
          
          const ordersWithProduct = ordersList.filter((order: any) => 
            order.orderItems && order.orderItems.some((item: any) => item.productId === productId)
          );
          
          // Xóa từng order có chứa sản phẩm
          for (const order of ordersWithProduct) {
            await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/${order.id}`, {
              method: 'DELETE',
              headers: getAuthHeaders()
            });
          }
        }
      }

      // Cuối cùng xóa sản phẩm
      const deleteResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        throw new Error(errorText || `HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`);
      }

      return await deleteResponse.text();
    } catch (error) {
      console.error('Lỗi khi force delete sản phẩm frontend:', error);
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
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw error;
    }
  },

  // Orders Management APIs
  getOrdersPaginated: async (page: number = 0, size: number = 10) => {
    try {
      console.log('Fetching orders with page:', page, 'size:', size);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw orders response:', data);
      console.log('Response type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Has content property:', data && typeof data === 'object' && 'content' in data);
      
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders`, {
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
      console.error('Lỗi khi lấy thông tin đơn hàng:', error);
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
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  },

  // Kiểm tra ràng buộc khi xóa đơn hàng
  checkOrderDeleteConstraints: async (orderId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/${orderId}/constraints`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        return await response.json();
      } else {
        // Fallback logic nếu API không tồn tại
        return {
          canDelete: true,
          constraints: {
            hasRelatedData: false,
            message: null
          }
        };
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc đơn hàng:', error);
      return {
        canDelete: true,
        constraints: {
          hasRelatedData: false,
          message: 'Không thể kiểm tra ràng buộc'
        }
      };
    }
  },

  // Xóa đơn hàng với kiểm tra ràng buộc
  deleteOrderWithConstraints: async (orderId: number, forceDelete: boolean = false) => {
    try {
      if (!forceDelete) {
        const constraints = await adminAPI.checkOrderDeleteConstraints(orderId);
        if (!constraints.canDelete) {
          throw new Error(`Không thể xóa đơn hàng vì có ràng buộc: ${constraints.constraints.message}`);
        }
      }

      return await adminAPI.deleteOrder(orderId);
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng với ràng buộc:', error);
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
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
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

  // Revenue Report APIs
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
  },

  // Kiểm tra ràng buộc khi xóa user bằng cách get toàn bộ other và so khớp ID
  checkUserDeletionConstraints: async (userId: number) => {
    try {
      console.log('Bắt đầu kiểm tra ràng buộc cho user ID:', userId);
      
      // Lấy toàn bộ orders và kiểm tra có order nào thuộc về user này không
      const orders = await adminAPI.getAllOrders();
      console.log('Tất cả orders:', orders);
      
      // Lấy thông tin user để so khớp
      const userDetails = await adminAPI.getUserById(userId);
      console.log('User details để so khớp:', userDetails);
      
      const userOrders = orders.content?.filter((order: any) => {
        // So khớp dựa trên email, phone, hoặc name của customer
        const emailMatch = order.customerEmail === userDetails.email;
        const phoneMatch = order.customerPhone === userDetails.phoneNumber;
        const nameMatch = order.customerName === userDetails.name;
        
        console.log(`Order ${order.orderId}: customerEmail=${order.customerEmail}, customerPhone=${order.customerPhone}, customerName=${order.customerName}`);
        console.log(`User: email=${userDetails.email}, phone=${userDetails.phoneNumber}, name=${userDetails.name}`);
        console.log(`Matches: email=${emailMatch}, phone=${phoneMatch}, name=${nameMatch}`);
        
        return emailMatch || phoneMatch || nameMatch;
      }) || [];
      
      console.log('Orders liên quan đến user:', userOrders);
      
      // Lấy cart items của user cụ thể
      let userCartItems = [];
      try {
        // Thử lấy cart items của user cụ thể
        const userCartResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}/cart-items`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        
        if (userCartResponse.ok) {
          const userCartData = await userCartResponse.json();
          userCartItems = userCartData.cartItems || userCartData || [];
          console.log('Cart items của user:', userCartItems);
        } else {
          console.log('Không có cart items cho user này hoặc API không tồn tại');
          userCartItems = [];
        }
      } catch (cartError) {
        console.log('Không thể lấy cart items:', cartError);
        userCartItems = [];
      }
      
      console.log('Cart items liên quan đến user:', userCartItems);
      
      // Tạo danh sách các ràng buộc cụ thể
      const constraintDetails = [];
      if (userOrders.length > 0) {
        constraintDetails.push(`${userOrders.length} đơn hàng`);
      }
      if (userCartItems.length > 0) {
        constraintDetails.push(`${userCartItems.length} sản phẩm trong giỏ hàng`);
      }
      
      // Nếu không có ràng buộc nào, có thể xóa
      const canDelete = userOrders.length === 0 && userCartItems.length === 0;
      
      console.log('Kết quả kiểm tra ràng buộc:', {
        userId,
        userOrdersCount: userOrders.length,
        userCartItemsCount: userCartItems.length,
        canDelete,
        constraintDetails
      });
      
      return {
        canDelete,
        constraints: {
          hasOrders: userOrders.length > 0,
          orderCount: userOrders.length,
          hasCartItems: userCartItems.length > 0,
          cartItemCount: userCartItems.length,
          constraintDetails,
          message: constraintDetails.length > 0 
            ? `Không thể xóa người dùng này vì có: ${constraintDetails.join(', ')}`
            : null
        }
      };
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc user:', error);
      return {
        canDelete: false,
        constraints: {
          hasOrders: false,
          orderCount: 0,
          hasCartItems: false,
          cartItemCount: 0,
          constraintDetails: ['Lỗi kiểm tra ràng buộc'],
          message: 'Không thể kiểm tra ràng buộc: ' + (error instanceof Error ? error.message : 'Lỗi không xác định')
        }
      };
    }
  },

  // Utility function để xóa user và tất cả dữ liệu liên quan
  deleteUserWithConstraints: async (userId: number, forceDelete: boolean = false) => {
    try {
      if (!forceDelete) {
        const constraints = await adminAPI.checkUserDeletionConstraints(userId);
        if (!constraints.canDelete) {
          throw new Error(`Không thể xóa user vì có ràng buộc: ${JSON.stringify(constraints.constraints)}`);
        }
      }

      // Nếu force delete, xóa tất cả dữ liệu liên quan trước
      if (forceDelete) {
        // Xóa cart items
        await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}/cart-items`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        }).catch(() => {}); // Ignore errors

        // Xóa orders
        const orders = await adminAPI.getAllOrders();
        const userOrders = orders.content?.filter((order: any) => order.customerId === userId) || [];
        for (const order of userOrders) {
          await adminAPI.deleteOrder(order.id).catch(() => {}); // Ignore errors
        }
      }

      // Xóa user
      return await adminAPI.deleteUser(userId);
    } catch (error) {
      console.error('Lỗi khi xóa user với ràng buộc:', error);
      throw error;
    }
  },

  // Utility function để kiểm tra xem có thể xóa product không
  checkProductDeletionConstraints: async (productId: number) => {
    try {
      // Kiểm tra xem sản phẩm có trong đơn hàng không
      const orders = await adminAPI.getAllOrders();
      const productOrders = orders.content?.filter((order: any) => 
        order.orderItems?.some((item: any) => item.productId === productId)
      ) || [];
      
      // Kiểm tra xem sản phẩm có trong giỏ hàng không
      const cartItems = await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}/cart-items`, {
        method: 'GET',
        headers: getAuthHeaders()
      }).then(res => res.ok ? res.json() : []).catch(() => []);

      return {
        canDelete: productOrders.length === 0 && cartItems.length === 0,
        constraints: {
          hasOrders: productOrders.length > 0,
          orderCount: productOrders.length,
          hasCartItems: cartItems.length > 0,
          cartItemCount: cartItems.length
        }
      };
    } catch (error) {
      console.error('Lỗi khi kiểm tra ràng buộc xóa product:', error);
      return {
        canDelete: false,
        constraints: {
          hasOrders: false,
          orderCount: 0,
          hasCartItems: false,
          cartItemCount: 0,
          error: error instanceof Error ? error.message : 'Lỗi không xác định'
        }
      };
    }
  },

  // Utility function để xóa product và tất cả dữ liệu liên quan
  deleteProductWithConstraints: async (productId: number, forceDelete: boolean = false) => {
    try {
      if (!forceDelete) {
        const constraints = await adminAPI.checkProductDeletionConstraints(productId);
        if (!constraints.canDelete) {
          throw new Error(`Không thể xóa sản phẩm vì có ràng buộc: ${JSON.stringify(constraints.constraints)}`);
        }
      }

      // Nếu force delete, xóa tất cả dữ liệu liên quan trước
      if (forceDelete) {
        // Xóa cart items chứa sản phẩm này
        await fetch(`${API_CONFIG.BASE_URL}/api/admin/products/${productId}/cart-items`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        }).catch(() => {}); // Ignore errors

        // Xóa order details chứa sản phẩm này
        const orders = await adminAPI.getAllOrders();
        const productOrders = orders.content?.filter((order: any) => 
          order.orderItems?.some((item: any) => item.productId === productId)
        ) || [];
        
        for (const order of productOrders) {
          // Xóa order detail items chứa sản phẩm này
          const orderItems = order.orderItems?.filter((item: any) => item.productId === productId) || [];
          for (const item of orderItems) {
            await fetch(`${API_CONFIG.BASE_URL}/api/admin/orders/${order.id}/items/${item.id}`, {
              method: 'DELETE',
              headers: getAuthHeaders()
            }).catch(() => {}); // Ignore errors
          }
        }
      }

      // Xóa sản phẩm
      return await adminAPI.deleteProduct(productId);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm với ràng buộc:', error);
      throw error;
    }
  }
}; 