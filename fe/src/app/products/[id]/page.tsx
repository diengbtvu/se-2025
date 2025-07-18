"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { ProductResponse } from "@/types/api";
import AddToCartButtons from "@/components/common/AddToCartButtons";
import { API_CONFIG } from "@/config/api";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { products, loading, error, fetchProducts } = useProducts();

  const productId = params.id ? parseInt(params.id as string) : null;

  // Products are automatically fetched by useProducts hook

  // Find the specific product
  const product = products.find(p => p.id === productId);

  // Xử lý ảnh sản phẩm từ server
  let imageUrl = product?.image || '';
  if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${API_CONFIG.BASE_URL}${imageUrl}`;
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

  if (error) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p>Lỗi khi tải thông tin sản phẩm: {error}</p>
            </div>
            <Link
              href="/products"
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
            <p className="text-gray-600 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link
              href="/products"
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-[#65BD60] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/products" className="hover:text-[#65BD60] transition-colors">
                Sản phẩm
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-[#65BD60] font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src={imageUrl || "/images/honey and hive.webp"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Product Header */}
              <div>
                <h1 className="text-4xl font-bold text-[#4E4540] mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-[#65BD60]">
                    {product.price === 0 ? 'Liên hệ' : `${product.price.toLocaleString('vi-VN')} VNĐ`}
                  </span>
                  {/* Stock Status */}
                  {product.stockQuantity !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#4E4540] mb-4">
                    Tính năng nổi bật
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-[#65BD60] mr-3 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Product Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#4E4540] mb-4">
                  Thông tin chi tiết
                </h3>
                <div className="space-y-3">
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                  )}
                  {product.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">
                        {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  {product.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cập nhật lần cuối:</span>
                      <span className="font-medium">
                        {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã sản phẩm:</span>
                    <span className="font-medium">#{product.id}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {isAuthenticated ? (
                  <AddToCartButtons product={product} />
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
                      <p className="font-medium mb-2">💡 Cần đăng nhập để mua hàng</p>
                      <Link 
                        href="/login"
                        className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-6 py-2 rounded-lg font-semibold transition-all inline-block"
                      >
                        Đăng nhập ngay
                      </Link>
                    </div>
                  </div>
                )}
                
                <Link
                  href="/products"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl text-lg font-semibold transition-all text-center"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-[#4E4540] mb-8 text-center">
                Mô tả chi tiết
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                
                {product.features && product.features.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-[#4E4540] mb-6">
                      Tính năng chi tiết
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>


    </main>
  );
} 