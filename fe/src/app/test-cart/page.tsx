'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { productAPI } from '@/services/api';
import { ProductDTO } from '@/types/api';

export default function TestCartPage() {
  const { cart, loading, error, addToCart, removeFromCart, updateCartItem, checkoutAll, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  const fetchProducts = async () => {
    try {
      const productsData = await productAPI.getAll();
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(selectedProductId, quantity);
      alert('Đã thêm vào giỏ hàng!');
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await removeFromCart(productId);
      alert('Đã xóa khỏi giỏ hàng!');
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    try {
      await updateCartItem(productId, newQuantity);
      alert('Đã cập nhật số lượng!');
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCheckout = async () => {
    try {
      const order = await checkoutAll(note);
      alert('Đặt hàng thành công! Order ID: ' + order.id);
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Test Cart Page</h1>
        <p className="text-red-600">Vui lòng đăng nhập để test cart functionality</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Cart Functionality</h1>
      
      {/* Load Products */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">1. Load Products</h2>
        <button 
          onClick={fetchProducts}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Load Products
        </button>
        {products.length > 0 && (
          <div className="mt-4">
            <p>Loaded {products.length} products</p>
            <select 
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="mt-2 p-2 border rounded"
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (ID: {product.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Add to Cart */}
      <div className="mb-8 p-4 bg-green-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">2. Add to Cart</h2>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="p-2 border rounded w-20"
          />
          <button 
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Cart Status */}
      <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">3. Cart Status</h2>
        <p><strong>Total Items:</strong> {getTotalItems()}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>

      {/* Cart Items */}
      {cart && (
        <div className="mb-8 p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">4. Cart Items</h2>
          {cart.cartItems && cart.cartItems.length > 0 ? (
            <div className="space-y-4">
              {cart.cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <p><strong>{item.productName}</strong></p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price?.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-white rounded border">
                <p><strong>Total Amount:</strong> {cart.totalAmount?.toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Total Items:</strong> {cart.totalItems}</p>
              </div>
            </div>
          ) : (
            <p>Giỏ hàng trống</p>
          )}
        </div>
      )}

      {/* Checkout */}
      {cart && cart.cartItems && cart.cartItems.length > 0 && (
        <div className="mb-8 p-4 bg-purple-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">5. Checkout</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Note:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Ghi chú đơn hàng..."
              />
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Checkout All Items'}
            </button>
          </div>
        </div>
      )}

      {/* Raw Cart Data */}
      {cart && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">6. Raw Cart Data</h2>
          <pre className="bg-white p-4 rounded border overflow-auto text-sm">
            {JSON.stringify(cart, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 