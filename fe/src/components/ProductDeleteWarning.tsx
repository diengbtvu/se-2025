'use client';

interface ProductDeleteWarningProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: number;
  constraints: {
    cartItems: number;
    orderItems: number;
    totalOrders: number;
    cartDetails?: any[];
    orderDetails?: any[];
    message?: string;
  };
}

export default function ProductDeleteWarning({
  isOpen,
  onClose,
  productName,
  productId,
  constraints
}: ProductDeleteWarningProps) {
  if (!isOpen) return null;

  const hasCartItems = constraints.cartItems > 0;
  const hasOrderItems = constraints.orderItems > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-orange-900">
            Sản phẩm đang được sử dụng
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-3">
            Sản phẩm <strong>"{productName}"</strong> hiện đang được sử dụng trong hệ thống nên không thể xóa.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-orange-800 font-medium">Sản phẩm đang được sử dụng</span>
            </div>
            
            <div className="text-sm text-orange-700 space-y-2">
              {hasCartItems && (
                <div>
                  <div className="flex items-center mb-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <span>Có {constraints.cartItems} khách hàng đang có sản phẩm này trong giỏ hàng:</span>
                  </div>
                  {constraints.cartDetails && constraints.cartDetails.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {constraints.cartDetails.map((cart: any, index: number) => (
                        <div key={index} className="text-xs bg-orange-100 p-2 rounded">
                          <span className="font-medium">Cart Item ID: {cart.id}</span>
                          <br />
                          <span>Cart ID: {cart.cartId} | User: {cart.userName || cart.userId}</span>
                          <br />
                          <span>Số lượng: {cart.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {hasOrderItems && (
                <div>
                  <div className="flex items-center mb-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <span>Có {constraints.orderItems} sản phẩm trong {constraints.totalOrders} đơn hàng:</span>
                  </div>
                  {constraints.orderDetails && constraints.orderDetails.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {constraints.orderDetails.map((order: any, index: number) => (
                        <div key={index} className="text-xs bg-orange-100 p-2 rounded">
                          <span className="font-medium">Đơn hàng #{order.orderNumber || order.orderId}</span>
                          <br />
                          <span>Khách hàng: {order.customerName} | Trạng thái: {order.status}</span>
                          <br />
                          <span>Items: {order.items.map((item: any) => `ID:${item.id} (${item.quantity})`).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-800 font-medium">Cách xử lý</span>
          </div>
          <div className="text-sm text-blue-700 space-y-3">
            <div>
              <p className="font-medium mb-1">1. Xóa khỏi giỏ hàng:</p>
              <p className="text-xs text-gray-600">Vào <strong>Quản lý giỏ hàng</strong> → Tìm và xóa các Cart Item ID ở trên</p>
            </div>
            <div>
              <p className="font-medium mb-1">2. Xử lý đơn hàng:</p>
              <p className="text-xs text-gray-600">Vào <strong>Quản lý đơn hàng</strong> → Tìm và xử lý các đơn hàng có ID ở trên</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium text-sm">Đường dẫn nhanh</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• <strong>Giỏ hàng:</strong> /admin/cart (nếu có)</p>
            <p>• <strong>Đơn hàng:</strong> /admin/orders</p>
            <p>• <strong>Quay lại:</strong> /admin/products</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            {hasOrderItems && (
              <a
                href="/admin/orders"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Xem đơn hàng
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
} 