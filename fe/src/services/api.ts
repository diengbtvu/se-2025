// API Service Layer for BeeLife Ventures
import { API_CONFIG } from '@/config/api';

// Base URL
const BASE_URL = API_CONFIG.BASE_URL;

// Authentication token storage
let authToken: string | null = null;

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Authorization': authToken ? `Bearer ${authToken}` : '',
  'Content-Type': 'application/json'
});



// Authentication APIs
export const authAPI = {
  // Login - returns JSON with token and role
  login: (userName: string, password: string) => {
    const loginData = { userName, password };
    
    console.log('Sending login request to:', `${BASE_URL}/api/auth/login`);
    console.log('Login data:', loginData);
    
    return fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(res => {
      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      
      // Thử parse JSON trước, nếu fail thì xử lý như text
      return res.text().then(text => {
        console.log('Raw response from server:', text);
        console.log('Response type:', typeof text);
        console.log('Response length:', text.length);
        
        try {
          // Thử parse JSON
          const jsonResponse = JSON.parse(text);
          console.log('Successfully parsed JSON:', jsonResponse);
          return jsonResponse;
        } catch (parseError) {
          // Nếu không phải JSON, xử lý như text (token trực tiếp)
          console.log('Response is not JSON, treating as text token:', text);
          console.log('Parse error:', parseError);
          
          // Kiểm tra nếu response bắt đầu với HTML
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            throw new Error('Server returned HTML instead of JSON. Please check the API endpoint.');
          }
          
          return {
            token: text,
            role: 'USER',
            message: 'Login successful'
          };
        }
      });
    })
    .then(response => {
      // Extract token from response (remove "Bearer: " prefix if present)
      const token = response.token.startsWith('Bearer: ') ? response.token.substring(8) : response.token;
      authToken = token;
      // Lưu token vào localStorage để persist
      localStorage.setItem('token', token);
      // Lưu role nếu cần
      if (response.role) {
        localStorage.setItem('userRole', response.role);
      }
      return response;
    });
  },

  // Register - returns message as text (Vì API trả về thông báo dạng text)
  register: (userData: {
    userName: string;
    password: string;
    name: string;
    phoneNumber: string;
    email: string;
  }) => {
    return fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(res => res.text())
    .then(message => message)
    .catch(err => {
      console.error('Lỗi đăng ký:', err);
      throw err;
    });
  },

  // Get profile - returns JSON
  getProfile: () => {
    return fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(profileData => profileData)
    .catch(err => {
      console.error('Lỗi lấy profile:', err);
      throw err;
    });
  },

  // Update profile - returns JSON
  updateProfile: (profileData: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  }) => {
    return fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(updatedProfile => updatedProfile)
    .catch(err => {
      console.error('Lỗi cập nhật profile:', err);
      throw err;
    });
  },

  // Set token (for persistence)
  setToken: (token: string) => {
    // Xử lý token có format "Bearer: eyJhbGciOiJIUzUxMiJ9..."
    authToken = token.startsWith('Bearer: ') ? token.substring(8) : token;
  },

  // Get current token
  getToken: () => authToken,

  // Clear token (logout)
  clearToken: () => {
    authToken = null;
  }
};

// Product APIs
export const productAPI = {
  // Get all products - returns JSON (NO auth required)
  getAll: () => {
    return fetch(`${BASE_URL}/api/product`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(products => products)
    .catch(err => {
      console.error('Lỗi lấy sản phẩm:', err);
      throw err;
    });
  },

  // Add new product - returns text message
  create: (productData: any) => {
    return fetch(`${BASE_URL}/api/product`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    .then(res => res.text())
    .then(message => message)
    .catch(err => {
      console.error('Lỗi thêm sản phẩm:', err);
      throw err;
    });
  },

  // Update product - returns JSON
  update: (productData: any) => {
    return fetch(`${BASE_URL}/api/product`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    .then(res => res.json())
    .then(product => product)
    .catch(err => {
      console.error('Lỗi cập nhật sản phẩm:', err);
      throw err;
    });
  },

  // Delete product - returns text message
  delete: (productData: any) => {
    return fetch(`${BASE_URL}/api/product`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    .then(res => res.text())
    .then(message => message)
    .catch(err => {
      console.error('Lỗi xóa sản phẩm:', err);
      throw err;
    });
  }
};

// Cart APIs
export const cartAPI = {
  // Add item to cart
  addItem: (productId: number, quantity: number) => {
    console.log('Adding to cart:', { productId, quantity });
    
    return fetch(`${BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    })
    .then(res => {
      console.log('Cart add response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Cart add error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(cart => {
      console.log('Cart add success:', cart);
      return cart;
    })
    .catch(err => {
      console.error('Lỗi thêm vào giỏ hàng:', err);
      throw err;
    });
  },

  // Get cart
  getCart: () => {
    console.log('Fetching cart...');
    
    return fetch(`${BASE_URL}/api/cart`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    .then(res => {
      console.log('Cart get response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          // Don't log authentication errors as they're expected during logout
          if (!text.includes('Token không hợp lệ') && !text.includes('Unauthorized')) {
            console.error('Cart get error response:', text);
          }
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(cart => {
      console.log('Cart get success:', cart);
      return cart;
    })
    .catch(err => {
      // Don't log authentication errors
      if (!err.message.includes('Token không hợp lệ') && !err.message.includes('Unauthorized')) {
        console.error('Lỗi lấy giỏ hàng:', err);
      }
      throw err;
    });
  },

  // Update cart item quantity
  updateItem: (productId: number, quantity: number) => {
    console.log('Updating cart item:', { productId, quantity });
    
    return fetch(`${BASE_URL}/api/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    })
    .then(res => {
      console.log('Cart update response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Cart update error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(cart => {
      console.log('Cart update success:', cart);
      return cart;
    })
    .catch(err => {
      console.error('Lỗi cập nhật giỏ hàng:', err);
      throw err;
    });
  },

  // Remove item from cart
  removeItem: (productId: number) => {
    console.log('Removing cart item:', productId);
    
    return fetch(`${BASE_URL}/api/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    .then(res => {
      console.log('Cart remove response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Cart remove error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(result => {
      console.log('Cart remove success:', result);
      return result;
    })
    .catch(err => {
      console.error('Lỗi xóa khỏi giỏ hàng:', err);
      throw err;
    });
  },

  // Checkout cart
  checkout: (checkoutData: {
    status: string;
    note?: string;
    selectedCartItemIds: number[];
  }) => {
    console.log('Checkout cart:', checkoutData);
    
    return fetch(`${BASE_URL}/api/cart/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(checkoutData)
    })
    .then(res => {
      console.log('Cart checkout response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Cart checkout error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(order => {
      console.log('Cart checkout success:', order);
      return order;
    })
    .catch(err => {
      console.error('Lỗi đặt hàng:', err);
      throw err;
    });
  },

  // Clear all items from cart
  clearCart: () => {
    console.log('Clearing cart...');
    
    return fetch(`${BASE_URL}/api/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    .then(res => {
      console.log('Cart clear response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Cart clear error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      // API trả về text message, không phải JSON
      return res.text();
    })
    .then(message => {
      console.log('Cart clear success:', message);
      return message;
    })
    .catch(err => {
      console.error('Lỗi xóa giỏ hàng:', err);
      throw err;
    });
  }
};

// Orders APIs
export const ordersAPI = {
  // Get all orders - returns JSON
  getAll: () => {
    return fetch(`${BASE_URL}/api/orders`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(orders => {
      // Map lại các trường cho đúng với frontend
      return orders.map((order: any) => ({
        id: order.orderId,
        orderDate: order.orderDate,
        status: order.status,
        customerName: order.customerName,
        customerAddress: order.customerAddress,
        note: order.note,
        totalAmount: order.total,
        itemCount: order.orderItems ? order.orderItems.length : 0,
        orderItems: order.orderItems
      }));
    })
    .catch(err => {
      console.error('Lỗi lấy danh sách đơn hàng:', err);
      throw err;
    });
  },

  // Get order by ID - returns JSON
  getById: (id: number) => {
    return fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(order => order)
    .catch(err => {
      console.error('Lỗi lấy đơn hàng:', err);
      throw err;
    });
  },

  // Cancel order - returns text message
  cancel: (id: number) => {
    return fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.text();
    })
    .then(message => message)
    .catch(err => {
      console.error('Lỗi hủy đơn hàng:', err);
      throw err;
    });
  },

  // Buy now - create order directly from product (if backend supports this)
  buyNow: (productId: number, quantity: number, note?: string) => {
    console.log('Buy now:', { productId, quantity, note });
    
    return fetch(`${BASE_URL}/api/orders/buy-now`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity, note })
    })
    .then(res => {
      console.log('Buy now response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Buy now error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(order => {
      console.log('Buy now success:', order);
      return order;
    })
    .catch(err => {
      console.error('Lỗi mua ngay:', err);
      throw err;
    });
  },

  // Create order directly
  createOrder: (orderData: {
    status: string;
    note?: string;
    orderItems: Array<{
      productId: number;
      quantity: number;
      price: number;
    }>;
  }) => {
    console.log('Creating order:', orderData);
    
    return fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    })
    .then(res => {
      console.log('Create order response status:', res.status);
      
      if (!res.ok) {
        return res.text().then(text => {
          console.error('Create order error response:', text);
          throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(order => {
      console.log('Create order success:', order);
      return order;
    })
    .catch(err => {
      console.error('Lỗi tạo đơn hàng:', err);
      throw err;
    });
  }
}; 