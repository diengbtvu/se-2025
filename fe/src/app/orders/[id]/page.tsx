"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_CONFIG } from "@/config/api";
import Image from "next/image";

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể tải chi tiết đơn hàng');
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Không thể hủy đơn hàng');
      alert('Đơn hàng đã được hủy thành công!');
      router.push('/orders');
    } catch (err: any) {
      alert(err.message || 'Lỗi không xác định');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Chờ xử lý';
    }
  };
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl && !imageUrl.startsWith('http')) {
      return `${API_CONFIG.BASE_URL}${imageUrl}`;
    }
    return imageUrl || "/images/honey and hive.webp";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to default image if loading fails
    e.currentTarget.src = "/images/honey and hive.webp";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải chi tiết đơn hàng...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-[#4E4540]">Chi tiết đơn hàng #{order.id}</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Mã đơn hàng:</span><span>#{order.id}</span></div>
                <div className="flex justify-between"><span>Ngày đặt:</span><span>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span></div>
                <div className="flex justify-between"><span>Trạng thái:</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span></div>
                <div className="flex justify-between"><span>Tổng tiền:</span><span className="font-bold text-[#65BD60]">{order.totalAmount?.toLocaleString('vi-VN')} VNĐ</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
              <div className="space-y-2">
                {order.customerName && <div className="flex justify-between"><span>Tên khách hàng:</span><span>{order.customerName}</span></div>}
                {order.customerAddress && <div className="flex justify-between"><span>Địa chỉ giao hàng:</span><span>{order.customerAddress}</span></div>}
                {order.note && <div className="flex justify-between"><span>Ghi chú:</span><span>{order.note}</span></div>}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h3>
          <div className="space-y-4">
            {order.orderItems && order.orderItems.length > 0 ? order.orderItems.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Image 
                    src={getImageUrl(item.imageUrl || '')} 
                    alt={item.productName || `Sản phẩm ${idx + 1}`} 
                    width={80} 
                    height={80} 
                    className="rounded-lg object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium">{item.productName || `Sản phẩm ${idx + 1}`}</h4>
                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Đơn giá: {item.price?.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#65BD60]">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            )) : <div>Không có sản phẩm nào.</div>}
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={() => router.push('/orders')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-all">Quay lại</button>
            {order.status === 'pending' && (
              <button onClick={handleCancelOrder} disabled={cancelling} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50">{cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 