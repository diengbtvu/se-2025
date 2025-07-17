import { 
  calculateStockStatus, 
  getStockStatusClasses, 
  getStockQuantityColor, 
  formatStockQuantity,
  isOutOfStock,
  isLowStock
} from '@/utils/stockUtils';

describe('stockUtils', () => {
  describe('calculateStockStatus', () => {
    it('should return correct status for out of stock', () => {
      const status = calculateStockStatus(0);
      expect(status.isInStock).toBe(false);
      expect(status.isLowStock).toBe(false);
      expect(status.stockQuantity).toBe(0);
      expect(status.statusText).toBe('Hết hàng');
      expect(status.statusColor).toBe('red');
    });

    it('should return correct status for low stock', () => {
      const status = calculateStockStatus(5);
      expect(status.isInStock).toBe(true);
      expect(status.isLowStock).toBe(true);
      expect(status.stockQuantity).toBe(5);
      expect(status.statusText).toBe('Sắp hết (5)');
      expect(status.statusColor).toBe('yellow');
    });

    it('should return correct status for in stock', () => {
      const status = calculateStockStatus(50);
      expect(status.isInStock).toBe(true);
      expect(status.isLowStock).toBe(false);
      expect(status.stockQuantity).toBe(50);
      expect(status.statusText).toBe('Có sẵn');
      expect(status.statusColor).toBe('green');
    });

    it('should handle null and undefined values', () => {
      const status1 = calculateStockStatus(null);
      const status2 = calculateStockStatus(undefined);
      
      expect(status1.isInStock).toBe(false);
      expect(status2.isInStock).toBe(false);
      expect(status1.stockQuantity).toBe(0);
      expect(status2.stockQuantity).toBe(0);
    });

    it('should use custom low stock threshold', () => {
      const status = calculateStockStatus(15, 20);
      expect(status.isLowStock).toBe(true);
      expect(status.statusText).toBe('Sắp hết (15)');
    });
  });

  describe('getStockStatusClasses', () => {
    it('should return correct classes for green status', () => {
      const status = calculateStockStatus(50);
      const classes = getStockStatusClasses(status);
      expect(classes).toContain('bg-green-100');
      expect(classes).toContain('text-green-800');
    });

    it('should return correct classes for yellow status', () => {
      const status = calculateStockStatus(5);
      const classes = getStockStatusClasses(status);
      expect(classes).toContain('bg-yellow-100');
      expect(classes).toContain('text-yellow-800');
    });

    it('should return correct classes for red status', () => {
      const status = calculateStockStatus(0);
      const classes = getStockStatusClasses(status);
      expect(classes).toContain('bg-red-100');
      expect(classes).toContain('text-red-800');
    });
  });

  describe('getStockQuantityColor', () => {
    it('should return green color for positive stock', () => {
      expect(getStockQuantityColor(10)).toBe('text-green-600');
      expect(getStockQuantityColor(1)).toBe('text-green-600');
    });

    it('should return red color for zero or negative stock', () => {
      expect(getStockQuantityColor(0)).toBe('text-red-600');
      expect(getStockQuantityColor(-1)).toBe('text-red-600');
    });

    it('should return red color for null/undefined', () => {
      expect(getStockQuantityColor(null)).toBe('text-red-600');
      expect(getStockQuantityColor(undefined)).toBe('text-red-600');
    });
  });

  describe('formatStockQuantity', () => {
    it('should format positive numbers correctly', () => {
      expect(formatStockQuantity(10)).toBe('10');
      expect(formatStockQuantity(1)).toBe('1');
    });

    it('should handle zero and negative numbers', () => {
      expect(formatStockQuantity(0)).toBe('0');
      expect(formatStockQuantity(-1)).toBe('0');
    });

    it('should handle null/undefined', () => {
      expect(formatStockQuantity(null)).toBe('0');
      expect(formatStockQuantity(undefined)).toBe('0');
    });
  });

  describe('isOutOfStock', () => {
    it('should return true for zero or negative stock', () => {
      expect(isOutOfStock(0)).toBe(true);
      expect(isOutOfStock(-1)).toBe(true);
    });

    it('should return false for positive stock', () => {
      expect(isOutOfStock(1)).toBe(false);
      expect(isOutOfStock(10)).toBe(false);
    });

    it('should return true for null/undefined', () => {
      expect(isOutOfStock(null)).toBe(true);
      expect(isOutOfStock(undefined)).toBe(true);
    });
  });

  describe('isLowStock', () => {
    it('should return true for stock at or below threshold', () => {
      expect(isLowStock(10, 10)).toBe(true);
      expect(isLowStock(5, 10)).toBe(true);
    });

    it('should return false for stock above threshold', () => {
      expect(isLowStock(11, 10)).toBe(false);
      expect(isLowStock(20, 10)).toBe(false);
    });

    it('should return false for zero or negative stock', () => {
      expect(isLowStock(0, 10)).toBe(false);
      expect(isLowStock(-1, 10)).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(isLowStock(null, 10)).toBe(false);
      expect(isLowStock(undefined, 10)).toBe(false);
    });
  });
}); 