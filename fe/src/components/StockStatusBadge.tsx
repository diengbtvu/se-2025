'use client';

import { calculateStockStatus, getStockStatusClasses } from '@/utils/stockUtils';

interface StockStatusBadgeProps {
  stockQuantity: number | null | undefined;
  showQuantity?: boolean;
  className?: string;
}

export default function StockStatusBadge({ 
  stockQuantity, 
  showQuantity = false,
  className = '' 
}: StockStatusBadgeProps) {
  const stockStatus = calculateStockStatus(stockQuantity);
  
  return (
    <span className={`${getStockStatusClasses(stockStatus)} ${className}`}>
      {showQuantity && stockStatus.isInStock 
        ? `${stockStatus.statusText} (${stockStatus.stockQuantity})`
        : stockStatus.statusText
      }
    </span>
  );
} 