# CQRS Pattern Implementation in BeeLife Ventures Frontend

## 🎯 **Tổng quan CQRS**

**CQRS (Command Query Responsibility Segregation)** là một pattern tách biệt các thao tác **đọc (Query)** và **ghi (Command)** để tối ưu hiệu năng và khả năng mở rộng.

## 📁 **Cấu trúc CQRS đã triển khai**

```
fe/src/services/
├── commands/           # 🖊️ Command Operations (Write)
│   ├── ProductCommands.ts
│   └── CartCommands.ts
├── queries/            # 📖 Query Operations (Read)
│   ├── ProductQueries.ts
│   └── CartQueries.ts
└── hooks/              # 🎣 CQRS Hooks
    ├── useProductsCQRS.ts
    └── useCartCQRS.ts
```

## 🔄 **Command vs Query Separation**

### **Commands (Write Operations)**
```typescript
// ProductCommands.ts
export class ProductCommands {
  static async createProduct(productData: ProductDTO): Promise<string>
  static async updateProduct(productData: ProductDTO): Promise<ProductDTO>
  static async deleteProduct(productData: ProductDTO): Promise<string>
}

// CartCommands.ts
export class CartCommands {
  static async addToCart(productId: number, quantity: number): Promise<CartDTO>
  static async updateCartItem(productId: number, quantity: number): Promise<CartDTO>
  static async removeFromCart(productId: number): Promise<CartDTO>
  static async checkoutCart(checkoutData): Promise<any>
  static async clearCart(): Promise<string>
}
```

### **Queries (Read Operations)**
```typescript
// ProductQueries.ts
export class ProductQueries {
  static async getAllProducts(): Promise<ProductResponse[]>
  static async getProductById(id: number): Promise<ProductResponse>
  static async searchProducts(keyword: string): Promise<ProductResponse[]>
  static async getProductsByCategory(category: string): Promise<ProductResponse[]>
}

// CartQueries.ts
export class CartQueries {
  static async getCart(): Promise<CartDTO>
  static async getCartItemCount(): Promise<number>
  static async hasCartItems(): Promise<boolean>
  static async getCartTotal(): Promise<number>
}
```

## 🎣 **CQRS Hooks**

### **useProductsCQRS**
```typescript
const {
  // State
  products, loading, error,
  
  // Query Operations
  fetchProducts, searchProducts, getProductById,
  
  // Command Operations
  createProduct, updateProduct, deleteProduct
} = useProductsCQRS();
```

### **useCartCQRS**
```typescript
const {
  // State
  cart, loading, error,
  
  // Query Operations
  fetchCart, getCartItemCount, hasCartItems, getCartTotal,
  
  // Command Operations
  addToCart, updateCartItem, removeFromCart, checkout, clearCart
} = useCartCQRS();
```

## ✅ **Lợi ích của CQRS**

### 1. **Tách biệt trách nhiệm**
- **Commands**: Chỉ xử lý thay đổi state
- **Queries**: Chỉ xử lý đọc data
- **Hooks**: Kết hợp cả hai với state management

### 2. **Tối ưu hiệu năng**
- **Read Operations**: Có thể cache và optimize riêng
- **Write Operations**: Có thể scale riêng biệt
- **Parallel Processing**: Commands và Queries có thể chạy song song

### 3. **Dễ bảo trì và mở rộng**
- **Clear Separation**: Dễ debug và test
- **Modular Design**: Dễ thêm tính năng mới
- **Type Safety**: TypeScript interfaces rõ ràng

### 4. **Scalability**
- **Independent Scaling**: Có thể scale Commands và Queries riêng biệt
- **Caching Strategy**: Có thể implement caching cho Queries
- **Event Sourcing**: Có thể mở rộng thành Event Sourcing pattern

## 🚀 **Cách sử dụng**

### **Thay thế hook cũ**
```typescript
// ❌ Cũ (trộn lẫn Command/Query)
import { useProducts } from '@/hooks/useProducts';

// ✅ Mới (CQRS pattern)
import { useProductsCQRS } from '@/hooks/useProductsCQRS';
```

### **Sử dụng trong components**
```typescript
const ProductList = () => {
  const { 
    products, 
    loading, 
    fetchProducts, 
    searchProducts 
  } = useProductsCQRS();

  const { 
    addToCart, 
    getCartItemCount 
  } = useCartCQRS();

  // Query operations
  useEffect(() => {
    fetchProducts();
  }, []);

  // Command operations
  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
  };

  return (
    // Component JSX
  );
};
```

## 🔄 **Migration Plan**

### **Phase 1: Tạo CQRS Structure** ✅
- [x] Tạo `commands/` và `queries/` folders
- [x] Implement ProductCommands và ProductQueries
- [x] Implement CartCommands và CartQueries
- [x] Tạo CQRS hooks

### **Phase 2: Gradual Migration**
- [ ] Cập nhật components để sử dụng CQRS hooks
- [ ] Test và validate functionality
- [ ] Remove old hooks khi đã migrate xong

### **Phase 3: Advanced Features**
- [ ] Implement caching cho Queries
- [ ] Add Event Sourcing pattern
- [ ] Implement optimistic updates
- [ ] Add offline support

## 📊 **Performance Benefits**

| Aspect | Before CQRS | After CQRS |
|--------|-------------|-------------|
| **Code Organization** | Mixed Commands/Queries | Clear Separation |
| **Caching** | Limited | Query-specific caching |
| **Testing** | Complex | Easier unit testing |
| **Scalability** | Monolithic | Independent scaling |
| **Maintainability** | Hard to debug | Clear responsibility |

## 🎯 **Best Practices**

1. **Always separate Commands and Queries**
2. **Use TypeScript for type safety**
3. **Implement proper error handling**
4. **Add loading states for better UX**
5. **Cache frequently accessed queries**
6. **Use optimistic updates for better UX**

## 🔧 **Next Steps**

1. **Migrate existing components** để sử dụng CQRS hooks
2. **Add caching layer** cho Queries
3. **Implement Event Sourcing** cho Commands
4. **Add offline support** với local storage
5. **Performance monitoring** và optimization 