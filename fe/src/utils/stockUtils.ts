/**
 * Utility functions for stock management
 */

export interface StockStatus {
  isInStock: boolean;
  isLowStock: boolean;
  stockQuantity: number;
  statusText: string;
  statusColor: string;
}

/**
 * Calculate stock status based on stock quantity
 * @param stockQuantity - Current stock quantity
 * @param lowStockThreshold - Threshold for low stock warning (default: 10)
 * @returns StockStatus object
 */
export const calculateStockStatus = (
  stockQuantity: number | null | undefined, 
  lowStockThreshold: number = 10
): StockStatus => {
  const quantity = stockQuantity || 0;
  const isInStock = quantity > 0;
  const isLowStock = isInStock && quantity <= lowStockThreshold;

  let statusText: string;
  let statusColor: string;

  if (!isInStock) {
    statusText = 'Hết hàng';
    statusColor = 'red';
  } else if (isLowStock) {
    statusText = `Sắp hết (${quantity})`;
    statusColor = 'yellow';
  } else {
    statusText = 'Có sẵn';
    statusColor = 'green';
  }

  return {
    isInStock,
    isLowStock,
    stockQuantity: quantity,
    statusText,
    statusColor
  };
};

/**
 * Get CSS classes for stock status display
 * @param stockStatus - StockStatus object
 * @returns CSS classes string
 */
export const getStockStatusClasses = (stockStatus: StockStatus): string => {
  const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
  
  switch (stockStatus.statusColor) {
    case 'green':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'yellow':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'red':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

/**
 * Get text color class for stock quantity display
 * @param stockQuantity - Current stock quantity
 * @returns CSS class for text color
 */
export const getStockQuantityColor = (stockQuantity: number | null | undefined): string => {
  const quantity = stockQuantity || 0;
  
  if (quantity > 0) {
    return 'text-green-600';
  } else {
    return 'text-red-600';
  }
};

/**
 * Format stock quantity for display
 * @param stockQuantity - Current stock quantity
 * @returns Formatted string
 */
export const formatStockQuantity = (stockQuantity: number | null | undefined): string => {
  const quantity = stockQuantity || 0;
  return quantity.toString();
};

/**
 * Check if product is out of stock
 * @param stockQuantity - Current stock quantity
 * @returns boolean
 */
export const isOutOfStock = (stockQuantity: number | null | undefined): boolean => {
  return !stockQuantity || stockQuantity <= 0;
};

/**
 * Check if product has low stock
 * @param stockQuantity - Current stock quantity
 * @param threshold - Low stock threshold (default: 10)
 * @returns boolean
 */
export const isLowStock = (
  stockQuantity: number | null | undefined, 
  threshold: number = 10
): boolean => {
  const quantity = stockQuantity || 0;
  return quantity > 0 && quantity <= threshold;
}; 