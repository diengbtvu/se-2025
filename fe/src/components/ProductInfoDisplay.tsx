'use client';

interface ProductInfoDisplayProps {
  productId: number;
  category?: string;
  description?: string;
  productType?: string;
  imageUrl?: string;
  manufactureDate?: string;
  expiryDate?: string;
}

export default function ProductInfoDisplay({
  productId,
  category,
  description,
  productType,
  imageUrl,
  manufactureDate,
  expiryDate
}: ProductInfoDisplayProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID sản phẩm</label>
          <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border font-mono">{productId}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border min-h-[60px] whitespace-pre-wrap">
            {description || 'Chưa có mô tả'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
          <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
            {productType || 'Chưa có'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sản xuất</label>
          <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
            {formatDate(manufactureDate)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
          <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
            {formatDate(expiryDate)}
          </p>
        </div>
      </div>
    </div>
  );
} 