// CQRS Pattern Hook for Products
import { useState, useEffect, useCallback } from 'react';
import { ProductQueries } from '@/services/queries/ProductQueries';
import { ProductCommands } from '@/services/commands/ProductCommands';
import { ProductDTO, ProductResponse } from '@/types/api';
import { useAuth } from './useAuth';

interface ProductsState {
  products: ProductResponse[];
  loading: boolean;
  error: string | null;
}

export const useProductsCQRS = () => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: false,
    error: null
  });

  // QUERY OPERATIONS
  const fetchProducts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const products = await ProductQueries.getAllProducts();
      setState({
        products,
        loading: false,
        error: null
      });
      return products;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      setState({
        products: [],
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  }, []);

  const searchProducts = useCallback(async (keyword: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const products = await ProductQueries.searchProducts(keyword);
      setState({
        products,
        loading: false,
        error: null
      });
      return products;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search products';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const getProductById = useCallback(async (id: number) => {
    try {
      return await ProductQueries.getProductById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      throw new Error(errorMessage);
    }
  }, []);

  // COMMAND OPERATIONS
  const createProduct = useCallback(async (productData: ProductDTO) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const message = await ProductCommands.createProduct(productData);
      // Refresh products list after creating
      await fetchProducts();
      return { success: true, message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (productData: ProductDTO) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedProduct = await ProductCommands.updateProduct(productData);
      // Update the product in the list
      setState(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p),
        loading: false
      }));
      return { success: true, product: updatedProduct };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteProduct = useCallback(async (productData: ProductDTO) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const message = await ProductCommands.deleteProduct(productData);
      // Remove the product from the list
      setState(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== productData.id),
        loading: false
      }));
      return { success: true, message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Load products on mount (no auth required for public products)
  useEffect(() => {
    fetchProducts().catch(() => {
      // Silently fail on mount - products are public
    });
  }, [fetchProducts]);

  return {
    // State
    ...state,
    
    // Query Operations
    fetchProducts,
    searchProducts,
    getProductById,
    
    // Command Operations
    createProduct,
    updateProduct,
    deleteProduct
  };
}; 