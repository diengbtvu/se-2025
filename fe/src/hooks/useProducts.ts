import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '@/services/api';
import { ProductDTO, ProductResponse } from '@/types/api';
import { useAuth } from './useAuth';

interface ProductsState {
  products: ProductResponse[];
  loading: boolean;
  error: string | null;
}

export const useProducts = () => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: false,
    error: null
  });

  const fetchProducts = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    return productAPI.getAll()
      .then(products => {
        setState({
          products: Array.isArray(products) ? products : [],
          loading: false,
          error: null
        });
      })
      .catch(error => {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch products'
        });
      });
  }, []);

  const createProduct = (productData: ProductDTO) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    return productAPI.create(productData)
      .then(message => {
        // Refresh products list after creating
        return fetchProducts()
          .then(() => ({ success: true, message }));
      })
      .catch(error => {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error instanceof Error ? error.message : 'Failed to create product' };
      });
  };

  const updateProduct = (productData: ProductDTO) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    return productAPI.update(productData)
      .then(updatedProduct => {
        // Update the product in the list
        setState(prev => ({
          ...prev,
          products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p),
          loading: false
        }));
        return { success: true, product: updatedProduct };
      })
      .catch(error => {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update product' };
      });
  };

  const deleteProduct = (productData: ProductDTO) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    return productAPI.delete(productData)
      .then(message => {
        // Remove the product from the list
        setState(prev => ({
          ...prev,
          products: prev.products.filter(p => p.id !== productData.id),
          loading: false
        }));
        return { success: true, message };
      })
      .catch(error => {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete product' };
      });
  };

  // Load products on mount (auth required)
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  return {
    ...state,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}; 