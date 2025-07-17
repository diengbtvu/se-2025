'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '@/services/adminAPI';

interface ProductStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  averagePrice: number;
  totalStockValue: number;
  newProductsThisMonth: number;
  productGrowthRate: number;
}

interface ProductTypeData {
  type: string;
  count: number;
  percentage: number;
}

interface PriceRangeData {
  range: string;
  count: number;
  percentage: number;
  minPrice: number;
  maxPrice: number;
}

interface StockRangeData {
  range: string;
  count: number;
  percentage: number;
  minStock: number;
  maxStock: number;
}

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
}

export const ProductStatistics = () => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [productTypes, setProductTypes] = useState<ProductTypeData[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRangeData[]>([]);
  const [stockRanges, setStockRanges] = useState<StockRangeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductStatistics();
  }, []);

  const fetchProductStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all products
      const allProducts = await adminAPI.getAllProducts();
      const products = Array.isArray(allProducts) ? allProducts : 
                      (allProducts.content ? allProducts.content : 
                      (allProducts.data ? allProducts.data : []));

      // Calculate basic statistics
      const totalProducts = products.length;
      const inStockProducts = products.filter((p: Product) => p.stockQuantity > 0).length;
      const outOfStockProducts = products.filter((p: Product) => p.stockQuantity === 0).length;
      const lowStockProducts = products.filter((p: Product) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
      
      const totalPrice = products.reduce((sum: number, p: Product) => sum + p.price, 0);
      const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0;
      
      const totalStockValue = products.reduce((sum: number, p: Product) => sum + (p.price * p.stockQuantity), 0);

      // Calculate new products this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newProductsThisMonth = products.filter((product: Product) => {
        const productDate = new Date(product.manufactureDate);
        return productDate.getMonth() === currentMonth && productDate.getFullYear() === currentYear;
      }).length;

      // Calculate growth rate
      const productGrowthRate = totalProducts > 0 ? ((newProductsThisMonth / totalProducts) * 100) : 0;

      setStats({
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        lowStockProducts,
        averagePrice,
        totalStockValue,
        newProductsThisMonth,
        productGrowthRate
      });

      // Calculate product type distribution
      const typeCounts: { [key: string]: number } = {};
      products.forEach((product: Product) => {
        const type = product.productType || 'Không phân loại';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const typeData: ProductTypeData[] = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        percentage: totalProducts > 0 ? (count / totalProducts) * 100 : 0
      }));
      setProductTypes(typeData);

      // Calculate price range distribution
      const priceRangesData: PriceRangeData[] = [
        { range: 'Miễn phí', count: 0, percentage: 0, minPrice: 0, maxPrice: 0 },
        { range: '0-50K', count: 0, percentage: 0, minPrice: 1, maxPrice: 50000 },
        { range: '50K-100K', count: 0, percentage: 0, minPrice: 50000, maxPrice: 100000 },
        { range: '100K-200K', count: 0, percentage: 0, minPrice: 100000, maxPrice: 200000 },
        { range: '200K-500K', count: 0, percentage: 0, minPrice: 200000, maxPrice: 500000 },
        { range: '500K+', count: 0, percentage: 0, minPrice: 500000, maxPrice: Infinity }
      ];

      products.forEach((product: Product) => {
        if (product.price === 0) {
          priceRangesData[0].count++;
        } else if (product.price <= 50000) {
          priceRangesData[1].count++;
        } else if (product.price <= 100000) {
          priceRangesData[2].count++;
        } else if (product.price <= 200000) {
          priceRangesData[3].count++;
        } else if (product.price <= 500000) {
          priceRangesData[4].count++;
        } else {
          priceRangesData[5].count++;
        }
      });

      priceRangesData.forEach(range => {
        range.percentage = totalProducts > 0 ? (range.count / totalProducts) * 100 : 0;
      });
      setPriceRanges(priceRangesData);

      // Calculate stock range distribution
      const stockRangesData: StockRangeData[] = [
        { range: 'Hết hàng', count: 0, percentage: 0, minStock: 0, maxStock: 0 },
        { range: '1-10', count: 0, percentage: 0, minStock: 1, maxStock: 10 },
        { range: '11-50', count: 0, percentage: 0, minStock: 11, maxStock: 50 },
        { range: '51-100', count: 0, percentage: 0, minStock: 51, maxStock: 100 },
        { range: '100+', count: 0, percentage: 0, minStock: 101, maxStock: Infinity }
      ];

      products.forEach((product: Product) => {
        if (product.stockQuantity === 0) {
          stockRangesData[0].count++;
        } else if (product.stockQuantity <= 10) {
          stockRangesData[1].count++;
        } else if (product.stockQuantity <= 50) {
          stockRangesData[2].count++;
        } else if (product.stockQuantity <= 100) {
          stockRangesData[3].count++;
        } else {
          stockRangesData[4].count++;
        }
      });

      stockRangesData.forEach(range => {
        range.percentage = totalProducts > 0 ? (range.count / totalProducts) * 100 : 0;
      });
      setStockRanges(stockRangesData);

    } catch (error) {
      console.error('Lỗi khi lấy thống kê sản phẩm:', error);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
          <p className="mt-4 text-gray-600">Đang tải thống kê sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchProductStatistics}
            className="mt-4 px-4 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Có sẵn</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.inStockProducts}</p>
              <p className="text-xs text-gray-500">Trong kho</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-orange-600 text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Giá trung bình</p>
              <p className="text-2xl font-bold text-[#4E4540]">
                {(stats.averagePrice || 0).toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-purple-600 text-xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tăng trưởng</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.productGrowthRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Tháng này</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.outOfStockProducts}</p>
              <p className="text-xs text-gray-500">Cần bổ sung</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-yellow-600 text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sắp hết</p>
              <p className="text-2xl font-bold text-[#4E4540]">{stats.lowStockProducts}</p>
              <p className="text-xs text-gray-500">≤ 10 sản phẩm</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-indigo-600 text-xl">💎</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng giá trị</p>
              <p className="text-2xl font-bold text-[#4E4540]">
                {(stats.totalStockValue / 1000000).toFixed(1)}M VNĐ
              </p>
              <p className="text-xs text-gray-500">Trong kho</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Phân loại sản phẩm</h3>
          <div className="space-y-4">
            {productTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`
                    }}
                  ></div>
                  <span className="text-sm font-medium text-[#4E4540]">{type.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${type.percentage}%`,
                        backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {type.count} ({type.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Price Range Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Phân bố giá</h3>
          <div className="space-y-4">
            {priceRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{
                      backgroundColor: `hsl(${(index * 45) % 360}, 70%, 60%)`
                    }}
                  ></div>
                  <span className="text-sm font-medium text-[#4E4540]">{range.range}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${range.percentage}%`,
                        backgroundColor: `hsl(${(index * 45) % 360}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {range.count} ({range.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stock Range Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-[#4E4540] mb-4">Phân bố tồn kho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {stockRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{
                      backgroundColor: index === 0 ? '#ef4444' : 
                                     index === 1 ? '#f59e0b' : 
                                     index === 2 ? '#10b981' : 
                                     index === 3 ? '#3b82f6' : '#8b5cf6'
                    }}
                  ></div>
                  <span className="text-sm font-medium text-[#4E4540]">{range.range}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${range.percentage}%`,
                        backgroundColor: index === 0 ? '#ef4444' : 
                                       index === 1 ? '#f59e0b' : 
                                       index === 2 ? '#10b981' : 
                                       index === 3 ? '#3b82f6' : '#8b5cf6'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {range.count} ({range.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stock Status Pie Chart */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                {stockRanges.map((range, index) => {
                  const total = stockRanges.reduce((sum, r) => sum + r.count, 0);
                  const percentage = total > 0 ? range.count / total : 0;
                  const circumference = 2 * Math.PI * 56;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (percentage * circumference);
                  const previousPercentages = stockRanges
                    .slice(0, index)
                    .reduce((sum, r) => sum + (r.count / total), 0);
                  const rotation = previousPercentages * 360;

                  return (
                    <circle
                      key={index}
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform={`rotate(${rotation} 64 64)`}
                      style={{
                        color: index === 0 ? '#ef4444' : 
                               index === 1 ? '#f59e0b' : 
                               index === 2 ? '#10b981' : 
                               index === 3 ? '#3b82f6' : '#8b5cf6'
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-[#4E4540]">
                  {stats.totalProducts}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchProductStatistics}
          className="px-6 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors font-medium"
        >
          🔄 Làm mới thống kê
        </button>
      </div>
    </div>
  );
};

export default ProductStatistics; 