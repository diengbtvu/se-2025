'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/services/adminAPI';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productType: string;
  manufactureDate: string;
  expiryDate: string;
  stockQuantity: number;
  imageUrl: string;
  inStock: boolean;
  category: string;
}

export default function TestProducts() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const testProduct = {
    name: 'Test Product',
    description: 'This is a test product',
    price: 100000,
    productType: 'Test Type',
    manufactureDate: '2024-01-01',
    expiryDate: '2025-01-01',
    stockQuantity: 10,
    imageUrl: 'https://example.com/image.jpg',
    category: 'Test Category'
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getProductsPaginated(0, 10);
      console.log('Products response:', response);
      setProducts(response.content || response || []);
      setSuccess('Lấy danh sách sản phẩm thành công!');
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(`Lỗi khi lấy sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.createProduct(testProduct);
      console.log('Create product response:', response);
      setSuccess('Tạo sản phẩm thành công!');
      fetchProducts(); // Refresh list
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(`Lỗi khi tạo sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateProduct = async (productId: number) => {
    if (products.length === 0) {
      setError('Không có sản phẩm để cập nhật');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updateData = {
        ...testProduct,
        name: 'Updated Test Product',
        price: 150000
      };
      const response = await adminAPI.updateProduct(productId, updateData);
      console.log('Update product response:', response);
      setSuccess('Cập nhật sản phẩm thành công!');
      fetchProducts(); // Refresh list
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(`Lỗi khi cập nhật sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDeleteProduct = async (productId: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.deleteProduct(productId);
      console.log('Delete product response:', response);
      setSuccess('Xóa sản phẩm thành công!');
      fetchProducts(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(`Lỗi khi xóa sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetProduct = async (productId: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getProduct(productId);
      console.log('Get product response:', response);
      setSuccess(`Lấy thông tin sản phẩm ID ${productId} thành công!`);
    } catch (err: any) {
      console.error('Error getting product:', err);
      setError(`Lỗi khi lấy thông tin sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-600">Bạn không có quyền truy cập trang này</p>
            <Link href="/login" className="text-[#65BD60] hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
                Test CRUD Sản phẩm
              </h1>
              <p className="text-gray-600">
                Kiểm tra các chức năng thêm, sửa, xóa sản phẩm
              </p>
            </div>
            <Link
              href="/admin/products"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Quay lại
            </Link>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#4E4540] mb-4">Test Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Đang tải...' : 'Lấy danh sách'}
              </button>
              <button
                onClick={testCreateProduct}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
              </button>
              <button
                onClick={() => products.length > 0 && testUpdateProduct(products[0].id)}
                disabled={loading || products.length === 0}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm đầu'}
              </button>
              <button
                onClick={() => products.length > 0 && testDeleteProduct(products[0].id)}
                disabled={loading || products.length === 0}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Đang xóa...' : 'Xóa sản phẩm đầu'}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#4E4540]">
                Danh sách sản phẩm ({products.length})
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">Không có sản phẩm nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#4E4540]">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {(product.price || 0).toLocaleString()} VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => testGetProduct(product.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => testUpdateProduct(product.id)}
                              className="text-yellow-600 hover:text-yellow-800 transition-colors"
                            >
                              Cập nhật
                            </button>
                            <button
                              onClick={() => testDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Debug Info */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Debug Info</h3>
            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {user?.name} ({user?.role})</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
              <p><strong>Products Count:</strong> {products.length}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 