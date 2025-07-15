"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/adminAPI";

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

export default function AdminProducts() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, loading, user, router]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setError(null);
      
      const response = await adminAPI.getProductsPaginated(0, 100); // Lấy tất cả sản phẩm
      setProducts(response.content || response || []);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await adminAPI.deleteProduct(productToDelete.id);
      
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Refresh danh sách
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-600">
                Thêm, sửa, xóa sản phẩm trong hệ thống
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="mt-4 md:mt-0 bg-[#65BD60] hover:bg-[#4e9749] text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            >
              <span className="mr-2">➕</span>
              Thêm sản phẩm mới
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                >
                  {categories.map((category, index) => (
                    <option key={`${category}-${index}`} value={category}>
                      {category === "all" ? "Tất cả" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600">📦</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                  <p className="text-xl font-bold text-[#4E4540]">{products.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Có sẵn</p>
                  <p className="text-xl font-bold text-[#4E4540]">
                    {products.filter(p => p.inStock).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-red-600">❌</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hết hàng</p>
                  <p className="text-xl font-bold text-[#4E4540]">
                    {products.filter(p => !p.inStock).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">🏷️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Danh mục</p>
                  <p className="text-xl font-bold text-[#4E4540]">
                    {categories.length - 1}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#4E4540]">
                  Danh sách sản phẩm
                </h2>
                <button
                  onClick={fetchProducts}
                  disabled={loadingProducts}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loadingProducts ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-50 border-b border-red-200">
                <p className="text-red-700">Lỗi: {error}</p>
              </div>
            )}

            {loadingProducts ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
                <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-gray-500">📦</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#4E4540]">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4E4540]">
                          {product.price === 0 ? 'Miễn phí' : `${product.price.toLocaleString()} VNĐ`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.inStock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'Có sẵn' : 'Hết hàng'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="text-[#65BD60] hover:text-[#4e9749] transition-colors"
                            >
                              Sửa
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Xóa
                            </button>
                            <Link
                              href={`/products/${product.id}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Xem
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#4E4540] mb-4">
              Xác nhận xóa sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete.name}"? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 