"use client";

import { useState } from "react";
import { useProductsCQRS } from "@/hooks/useProductsCQRS";
import { useCartCQRS } from "@/hooks/useCartCQRS";
import { useAuth } from "@/hooks/useAuth";

export default function TestCQRS() {
  const { isAuthenticated } = useAuth();
  
  // CQRS Hooks
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    fetchProducts, 
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProductsCQRS();

  const {
    cart,
    loading: cartLoading,
    error: cartError,
    fetchCart,
    getCartItemCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    clearCart
  } = useCartCQRS();

  // Local state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: ""
  });

  // Test functions
  const handleSearch = async () => {
    if (searchKeyword.trim()) {
      try {
        await searchProducts(searchKeyword);
      } catch (error) {
        console.error("Search error:", error);
      }
    }
  };

  const handleCreateProduct = async () => {
    if (newProduct.name && newProduct.description && newProduct.price > 0) {
      try {
        const result = await createProduct(newProduct);
        if (result.success) {
          alert("Tạo sản phẩm thành công!");
          setNewProduct({ name: "", description: "", price: 0, imageUrl: "" });
        } else {
          alert("Lỗi: " + result.error);
        }
      } catch (error) {
        console.error("Create product error:", error);
      }
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    try {
      const selectedCartItemIds = cart.cartItems.map(item => item.id);
      await checkout({
        status: "pending",
        note: "Test checkout from CQRS",
        selectedCartItemIds
      });
      alert("Checkout thành công!");
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#4E4540] mb-8">
            🧪 Test CQRS Pattern
          </h1>

          {/* Authentication Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🔐 Authentication Status</h2>
            <p className="text-gray-600">
              Status: {isAuthenticated ? "✅ Authenticated" : "❌ Not authenticated"}
            </p>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">📦 Products (CQRS)</h2>
            
            {/* Search Products */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">🔍 Search Products (Query)</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Create Product */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">➕ Create Product (Command)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Giá"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="URL ảnh"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={handleCreateProduct}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Tạo sản phẩm
              </button>
            </div>

            {/* Products List */}
            <div>
              <h3 className="text-lg font-medium mb-2">📋 Products List (Query)</h3>
              {productsLoading ? (
                <p>Đang tải sản phẩm...</p>
              ) : productsError ? (
                <p className="text-red-500">Lỗi: {productsError}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-lg font-bold text-green-600">
                        {product.price?.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🛒 Cart (CQRS)</h2>
            
            {cartLoading ? (
              <p>Đang tải giỏ hàng...</p>
            ) : cartError ? (
              <p className="text-red-500">Lỗi: {cartError}</p>
            ) : cart ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Giỏ hàng ({cart.cartItems?.length || 0} items)</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => fetchCart()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={() => clearCart()}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {cart.cartItems?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-green-600">
                          {item.price?.toLocaleString('vi-VN')} VNĐ
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-right">
                  <p className="text-lg font-bold">
                    Tổng: {cart.totalAmount?.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>
            ) : (
              <p>Giỏ hàng trống</p>
            )}
          </div>

          {/* CQRS Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">ℹ️ CQRS Pattern Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">📖 Queries (Read Operations)</h3>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• fetchProducts() - Lấy danh sách sản phẩm</li>
                  <li>• searchProducts() - Tìm kiếm sản phẩm</li>
                  <li>• fetchCart() - Lấy giỏ hàng</li>
                  <li>• getCartItemCount() - Đếm số lượng item</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-700 mb-2">🖊️ Commands (Write Operations)</h3>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• createProduct() - Tạo sản phẩm mới</li>
                  <li>• updateProduct() - Cập nhật sản phẩm</li>
                  <li>• deleteProduct() - Xóa sản phẩm</li>
                  <li>• addToCart() - Thêm vào giỏ hàng</li>
                  <li>• checkout() - Thanh toán</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 