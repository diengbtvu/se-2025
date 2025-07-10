import { useState } from 'react';
import { ProductResponse, OrderItem } from '@/types/api';
import { useCart } from '@/hooks/useCart';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponse;
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== ORDER MODAL SUBMIT ===');
    console.log('Form submitted');
    console.log('Product:', product);
    console.log('Quantity:', quantity);
    
    setLoading(true);
    
    try {
      // Tạo orderItem với 3 thông tin cần thiết
      const orderItem: OrderItem = {
        productId: product.id,
        quantity: quantity,
        price: product.price
      };
      
      console.log('Created orderItem:', orderItem);
      
      // Tạo orderData
      const orderData = {
        orderItems: [orderItem]
      };
      
      console.log('Final orderData:', orderData);
      console.log('Calling addToCart...');
      
      // Thêm vào giỏ hàng
      addToCart(orderData);
      
      console.log('addToCart completed successfully');
      
      // Reset form và đóng modal
      setQuantity(1);
      setLoading(false);
      onClose();
      
      // Thông báo thành công
      alert('Đã thêm vào giỏ hàng thành công!');
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setLoading(false);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#4E4540]">Đặt hàng</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg text-[#4E4540] mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <p className="text-[#65BD60] font-bold">
            {product.price.toLocaleString('vi-VN')} VNĐ
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Debug: Product ID = {product.id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-[#65BD60]">
                {(product.price * quantity).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#65BD60] hover:bg-[#4e9749] text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
          </button>
        </form>
      </div>
    </div>
  );
} 