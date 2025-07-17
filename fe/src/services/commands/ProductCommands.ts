// Product Commands - Handle write operations
import { ProductDTO } from '@/types/api';
import { API_CONFIG } from '@/config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

export class ProductCommands {
  // Create new product
  static async createProduct(productData: ProductDTO): Promise<string> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  }

  // Update existing product
  static async updateProduct(productData: ProductDTO): Promise<ProductDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Delete product
  static async deleteProduct(productData: ProductDTO): Promise<string> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/product`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  }
} 