"use client";

import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { ProductResponse } from "@/types/api";
import AddToCartButtons from "@/components/common/AddToCartButtons";
import { API_CONFIG } from "@/config/api";

// Dynamic imports for ProductCard3D only
const ProductCard3D = dynamic(() => import("@/components/3d/ProductCard3D"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />
});

// Fallback products data in case API fails
const fallbackProducts = [
  {
    id: 1,
    name: "BeeLife Smart Hive",
    description: "Tổ ong thông minh với công nghệ giám sát 24/7",
    features: [
      "Cảm biến nhiệt độ và độ ẩm",
      "Camera quan sát trực tiếp",
      "Hệ thống thông gió tự động",
      "Pin năng lượng mặt trời",
    ],
    image: "/images/BeeHome Closed (5) (1)-1.jpg",
    price: 15000000,
    category: "Smart Hive",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "BeeLife Monitor",
    description: "Thiết bị theo dõi hoạt động đàn ong",
    features: [
      "Phân tích âm thanh đàn ong",
      "Cảnh báo sớm dịch bệnh",
      "Dự đoán năng suất mật",
      "Kết nối không dây",
    ],
    image: "/images/monitors your colonies 24_7-min.webp",
    price: 5000000,
    category: "Monitor",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "BeeLife App",
    description: "Ứng dụng quản lý trang trại ong",
    features: [
      "Theo dõi từ xa qua điện thoại",
      "Thống kê và báo cáo chi tiết",
      "Cảnh báo thông minh",
      "Hỗ trợ kỹ thuật 24/7",
    ],
    image: "/images/fits into existing workflows-min.webp",
    price: 0,
    category: "App",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Products() {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const { products, loading, error, fetchProducts } = useProducts();
  const { isAuthenticated } = useAuth();

  // Use API products if available, otherwise use fallback
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section with Image and Particles */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full brightness-50"
          >
            <source src="/videos/blur.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 text-white">
              Sản phẩm của chúng tôi
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Khám phá các giải pháp nuôi ong thông minh, được thiết kế với công nghệ tiên tiến
              và kinh nghiệm chuyên môn.
            </p>
            <button className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
              Xem chi tiết
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/BeeHome Closed (5) (1)-1.jpg"
              alt="BeeLife Smart Hive"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl font-bold text-[#4E4540]">
              Danh mục sản phẩm
            </h2>
            <button 
              onClick={() => fetchProducts()}
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
          
          {!isAuthenticated && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-8">
              <p>💡 <strong>Mẹo:</strong> Đăng nhập để xem sản phẩm và đặt hàng!</p>
              <p className="text-sm mt-2">Hiện tại đang hiển thị dữ liệu mẫu</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p>Lỗi khi tải sản phẩm: {error}</p>
              <p className="text-sm mt-2">Đang hiển thị dữ liệu mẫu</p>
            </div>
          )}
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
                onMouseEnter={() => setActiveProduct(product.id)}
                onMouseLeave={() => setActiveProduct(null)}
              >
                {/* Product Image */}
                <Link href={`/products/${product.id}`}>
                  {(() => {
                    let imageUrl = product.image || '';
                    if (imageUrl && !imageUrl.startsWith('http')) {
                      imageUrl = `${API_CONFIG.BASE_URL}${imageUrl}`;
                    }
                    return (
                      <Image
                        src={imageUrl || "/images/honey and hive.webp"}
                        alt={product.name}
                        width={500}
                        height={350}
                        className="object-cover w-full h-64 cursor-pointer"
                        priority
                      />
                    );
                  })()}
                </Link>
                
                <div className="p-6">
                  {/* Product Info */}
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-2xl font-semibold mb-4 text-[#4E4540] hover:text-[#65BD60] transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                  </Link>
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg
                            className="w-5 h-5 text-[#65BD60] mr-2"
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
                          {feature}
                        </li>
                      ))}
                      {product.features.length > 2 && (
                        <li className="text-sm text-gray-500">
                          +{product.features.length - 2} tính năng khác...
                        </li>
                      )}
                    </ul>
                  )}
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-[#65BD60]">
                      {product.price === 0 ? 'Liên hệ' : `${product.price.toLocaleString('vi-VN')} VNĐ`}
                    </span>
                  </div>
                  
                  {/* Add to Cart Buttons */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <AddToCartButtons 
                      product={product} 
                      className="mt-4"
                    />
                  </div>
                  
                  {/* Product Meta */}
                  {product.category && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Danh mục: {product.category}</span>
                      {product.stockQuantity !== undefined && (
                        <span className={`ml-4 text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🔍",
                title: "Giám sát thông minh",
                description: "Theo dõi hoạt động đàn ong 24/7",
              },
              {
                icon: "📱",
                title: "Điều khiển từ xa",
                description: "Quản lý trang trại mọi lúc mọi nơi",
              },
              {
                icon: "📊",
                title: "Phân tích dữ liệu",
                description: "Báo cáo chi tiết và dự đoán xu hướng",
              },
              {
                icon: "🛡️",
                title: "Bảo vệ đàn ong",
                description: "Phát hiện sớm và ngăn ngừa dịch bệnh",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl text-center hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#4E4540]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#65BD60]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-8">
            Sẵn sàng nâng cấp trang trại của bạn?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn giải pháp phù hợp nhất
            cho trang trại của bạn.
          </p>
          <button className="bg-white text-[#65BD60] hover:bg-[#f0f0f0] px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
            Liên hệ tư vấn
          </button>
        </div>
      </section>


    </main>
  );
} 