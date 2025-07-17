// API Data Types for BeeLife Ventures

// User Account DTO
export interface UserAccountDTO {
  userName: string;
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
}

// Product DTO
export interface ProductDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  productType?: string;
  stockQuantity?: number;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Cart DTO
export interface CartItem {
  id: number; // ID của cart item (cần thiết cho checkout)
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  subtotal?: number; // price * quantity
}

export interface CartDTO {
  id: number;
  customerId: number;
  customerName: string;
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Orders DTO
export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface OrdersDTO {
  id?: number;
  orderDate?: string;
  status?: string;
  customerName?: string;
  customerAddress?: string;
  note?: string;
  totalAmount?: number;
  itemCount?: number;
  orderItems?: OrderItem[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Login Response
export interface LoginResponse {
  token: string;
  role?: string;
  message?: string;
}

// Profile Response
export interface ProfileResponse {
  id: number;
  userName: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  role: string;
}

// Product Response
export interface ProductResponse extends ProductDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Order Response
export interface OrderResponse extends OrdersDTO {
  id: number;
  orderDate: string;
  customer?: ProfileResponse;
  product?: ProductResponse;
} 