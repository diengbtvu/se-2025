'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminAPI } from '@/services/adminAPI';
import ProductInfoDisplay from '@/components/ProductInfoDisplay';

interface ProductFormData {
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

export default function EditProduct() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  console.log('URL params:', params);
  console.log('Parsed productId:', productId, 'Type:', typeof productId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
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
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Lấy tất cả sản phẩm và tìm sản phẩm theo ID
      const response = await adminAPI.getAllProducts();
      
      // Kiểm tra cấu trúc dữ liệu trả về
      console.log('API response:', response);
      
      let allProducts = [];
      if (Array.isArray(response)) {
        allProducts = response;
      } else if (response && Array.isArray(response.data)) {
        allProducts = response.data;
      } else if (response && response.content && Array.isArray(response.content)) {
        allProducts = response.content;
      } else if (response && response.products && Array.isArray(response.products)) {
        allProducts = response.products;
      } else if (response && response.items && Array.isArray(response.items)) {
        allProducts = response.items;
      } else if (response && typeof response === 'object') {
        // Nếu response là object nhưng không có array, thử chuyển thành array
        console.log('Response is object, trying to convert to array');
        allProducts = [response];
      } else {
        console.error('Unexpected API response structure:', response);
        console.error('Response type:', typeof response);
        console.error('Response keys:', response ? Object.keys(response) : 'null');
        setError('Cấu trúc dữ liệu không hợp lệ');
        return;
      }
      
      console.log('Processed allProducts:', allProducts);
      console.log('allProducts type:', typeof allProducts);
      console.log('allProducts is array:', Array.isArray(allProducts));
      
      console.log('Looking for product with ID:', productId, 'Type:', typeof productId);
      
      // Kiểm tra an toàn trước khi map
      if (!Array.isArray(allProducts)) {
        console.error('allProducts is not an array:', allProducts);
        setError('Dữ liệu sản phẩm không hợp lệ');
        return;
      }
      
      console.log('Available products:', allProducts.map((p: any) => ({ id: p.id, type: typeof p.id, name: p.name })));
      
      const product = allProducts.find((p: any) => {
        if (!p || typeof p !== 'object') {
          console.log('Invalid product item:', p);
          return false;
        }
        console.log('Comparing:', p.id, '(', typeof p.id, ') with', productId, '(', typeof productId, ')');
        return p.id === productId || p.id == productId || String(p.id) === String(productId);
      });
      
      if (!product) {
        console.log('Product not found. Available IDs:', allProducts.map((p: any) => p.id));
        setError('Không tìm thấy sản phẩm');
        return;
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        productType: product.productType || '',
        manufactureDate: product.manufactureDate || '',
        expiryDate: product.expiryDate || '',
        stockQuantity: product.stockQuantity || 0,
        imageUrl: product.imageUrl || '',
        category: product.category || ''
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      setError('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Math.max(0, parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields - chỉ kiểm tra các trường được phép sửa
      if (!formData.name || formData.name.trim() === '') {
        throw new Error('Vui lòng nhập tên sản phẩm');
      }
      
      if (formData.price < 0) {
        throw new Error('Giá sản phẩm không được âm');
      }
      
      if (formData.stockQuantity < 0) {
        throw new Error('Số lượng tồn kho không được âm');
      }

      // Chỉ gửi các trường được phép sửa
      const updateData = {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        productType: formData.productType,
        manufactureDate: formData.manufactureDate,
        expiryDate: formData.expiryDate,
        stockQuantity: formData.stockQuantity,
        imageUrl: formData.imageUrl
      };

      await adminAPI.updateProduct(productId, updateData);
      
      // Show success message and redirect
      alert('Cập nhật sản phẩm thành công!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#4E4540] mb-2">
                Chỉnh sửa sản phẩm
              </h1>
              <p className="text-gray-600">
                Cập nhật thông tin sản phẩm trong hệ thống
              </p>
            </div>
            <Link
              href="/admin/products"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              ← Quay lại
            </Link>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Product Information Display (Read-only) */}
              <ProductInfoDisplay
                productId={productId}
                category={formData.category}
                description={formData.description}
                productType={formData.productType}
                imageUrl={formData.imageUrl}
                manufactureDate={formData.manufactureDate}
                expiryDate={formData.expiryDate}
              />

              {/* Editable Fields */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Chỉ có thể chỉnh sửa tên sản phẩm, giá, số lượng tồn kho và URL hình ảnh
                  </p>
                </div>
                
                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                    placeholder="Nhập tên sản phẩm"
                    minLength={1}
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      placeholder="Nhập giá sản phẩm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      placeholder="Nhập số lượng"
                    />
                  </div>
                </div>

                {/* Image URL */}
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
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/products"
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-all"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#65BD60] hover:bg-[#4e9749] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang cập nhật...
                    </div>
                  ) : (
                    'Cập nhật sản phẩm'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 