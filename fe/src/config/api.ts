// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
    },
    PRODUCTS: '/api/product',
    CART: {
      ADD: '/api/cart/add',
      GET: '/api/cart',
      UPDATE: '/api/cart/update',
      REMOVE: '/api/cart/remove',
      CHECKOUT: '/api/cart/checkout',
    },
    ORDERS: '/api/orders',
  }
}; 