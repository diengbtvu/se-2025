'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/services/adminAPI';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  productType: string;
  manufactureDate: string;
  expiryDate: string;
  stockQuantity: number;
  imageUrl: string;
  category: string;
}

export default function NewProduct() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    productType: '',
    manufactureDate: '',
    expiryDate: '',
    stockQuantity: 0,
    imageUrl: '',
    category: ''
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'ADMIN'))) {
      router.push('/login');
    }
  }, [isAuthenticated, user, loading, router]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminAPI.createProduct(formData);
      if (response.success) {
        setSuccess('Sản phẩm đã được tạo thành công!');
        setTimeout(() => {
          router.push('/admin/products');
        }, 2000);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
                Thêm sản phẩm mới
              </h1>
              <p className="text-gray-600">
                Tạo sản phẩm mới trong hệ thống
              </p>
            </div>
            <Link
              href="/admin/products"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            >
              <span className="mr-2">←</span>
              Quay lại
            </Link>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Thuốc">Thuốc</option>
                    <option value="Thực phẩm chức năng">Thực phẩm chức năng</option>
                    <option value="Dụng cụ y tế">Dụng cụ y tế</option>
                    <option value="Chăm sóc cá nhân">Chăm sóc cá nhân</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn kho *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại sản phẩm
                  </label>
                  <input
                    type="text"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    placeholder="Nhập loại sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL hình ảnh
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sản xuất
                  </label>
                  <input
                    type="date"
                    name="manufactureDate"
                    value={formData.manufactureDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#65BD60] hover:bg-[#4e9749] text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
                </button>
                <Link
                  href="/admin/products"
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all text-center"
                >
                  Hủy
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 