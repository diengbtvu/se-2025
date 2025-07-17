// Product Queries - Handle read operations
import { ProductResponse } from '@/types/api';
import { API_CONFIG } from '@/config/api';

export class ProductQueries {
  // Get all products (public query - no auth required)
  static async getAllProducts(): Promise<ProductResponse[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    return Array.isArray(products) ? products : [];
  }

  // Get product by ID
  static async getProductById(id: number): Promise<ProductResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Search products by keyword
  static async searchProducts(keyword: string): Promise<ProductResponse[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    return Array.isArray(products) ? products : [];
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<ProductResponse[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product/category/${encodeURIComponent(category)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    return Array.isArray(products) ? products : [];
  }
} 