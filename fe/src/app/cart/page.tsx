"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_CONFIG } from "@/config/api";

export default function Cart() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading, error, updateCartItem, removeFromCart, checkoutAll, clearCart } = useCart();
  const router = useRouter();
  const [note, setNote] = useState('');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(productId, newQuantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (!confirmed) {
      return;
    }

    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      const result = await removeFromCart(productId);
      console.log('Remove item result:', result);
      alert('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Không thể xóa sản phẩm: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      return;
    }

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?');
    if (!confirmed) {
      return;
    }

    setIsClearLoading(true);
    try {
      const result = await clearCart();
      console.log('Clear cart result:', result);
      alert('Đã xóa toàn bộ giỏ hàng');
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Không thể xóa giỏ hàng: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    } finally {
      setIsClearLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const order = await checkoutAll(note);
      alert('Đặt hàng thành công!');
      router.push('/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Không thể đặt hàng: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Xử lý ảnh sản phẩm từ server
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl && !imageUrl.startsWith('http')) {
      return `${API_CONFIG.BASE_URL}${imageUrl}`;
    }
    return imageUrl || "/images/honey and hive.webp";
  };

  if (authLoading || cartLoading) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#4E4540] mb-4">
              Giỏ hàng
            </h1>
            <p className="text-gray-600">
              Kiểm tra và thanh toán đơn hàng của bạn
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {!cart || !cart.cartItems || cart.cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
              <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Link
                href="/products"
                className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-[#4E4540]">
                        Sản phẩm ({cart.cartItems.length})
                      </h2>
                      <button
                        onClick={handleClearCart}
                        disabled={isClearLoading || !cart.cartItems || cart.cartItems.length === 0}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-red-50 transition-all"
                      >
                        {isClearLoading ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        )}
                        <span>Xóa tất cả</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {cart.cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <Image
                              src={getImageUrl(item.imageUrl || '')}
                              alt={item.productName}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-[#4E4540] mb-2">
                              {item.productName}
                            </h3>
                            <p className="text-lg font-bold text-[#65BD60]">
                              {item.price?.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={removingItems.has(item.productId)}
                            className={`p-2 rounded-md transition-all ${
                              removingItems.has(item.productId)
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            }`}
                          >
                            {removingItems.has(item.productId) ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-[#4E4540] mb-6">
                    Tóm tắt đơn hàng
                  </h2>
                  
                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">{cart.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium">
                        {cart.totalAmount && cart.totalAmount > 500000 ? 'Miễn phí' : '30,000 VNĐ'}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Tổng cộng:</span>
                        <span className="text-lg font-bold text-[#65BD60]">
                          {cart.totalAmount && cart.totalAmount > 500000 
                            ? cart.totalAmount.toLocaleString('vi-VN')
                            : (cart.totalAmount + 30000).toLocaleString('vi-VN')
                          } VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Note Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                      placeholder="Ghi chú về đơn hàng của bạn..."
                    />
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading || !cart.cartItems || cart.cartItems.length === 0}
                    className="w-full bg-[#65BD60] hover:bg-[#4e9749] disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
                  >
                    {isCheckoutLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : (
                      'Đặt hàng ngay'
                    )}
                  </button>
                  
                  {/* Continue Shopping */}
                  <div className="mt-4 text-center">
                    <Link
                      href="/products"
                      className="text-[#65BD60] hover:text-[#4e9749] font-medium"
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 