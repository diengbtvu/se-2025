# 🛡️ Giải Pháp Xử Lý Authentication Hoàn Chỉnh

## 📋 Tổng Quan

Giải pháp này đã được thiết kế để xử lý hoàn toàn các vấn đề authentication trong ứng dụng, bao gồm:
- Lỗi "Failed to fetch" khi token không hợp lệ
- Lỗi "Token không hợp lệ" khi user đã đăng xuất
- Xử lý graceful cho các trường hợp authentication failure
- Tự động refresh data khi user đăng nhập
- Tự động clear data khi user đăng xuất

## 🚀 Các Thành Phần Chính

### 1. **Authentication Utilities** (`fe/src/utils/authUtils.ts`)

```typescript
import { 
  isLoggedIn, 
  getAuthToken, 
  withAuthCheck, 
  safeApiCall, 
  clearAuthData 
} from '@/utils/authUtils';

// Kiểm tra đăng nhập
if (isLoggedIn()) {
  // User đã đăng nhập
}

// Lấy token
const token = getAuthToken();

// Wrapper với auth check
const result = await withAuthCheck(
  () => apiCall(),
  () => handleNotAuthenticated()
);

// Safe API call
const data = await safeApiCall(
  () => apiCall(),
  (error) => handleAuthError(error)
);
```

### 2. **Enhanced useAuth Hook** (`fe/src/hooks/useAuth.ts`)

```typescript
import { useAuth } from '@/hooks/useAuth';

const { 
  isAuthenticated, 
  user, 
  loading, 
  login, 
  logout, 
  checkLoginStatus 
} = useAuth();

// Kiểm tra trạng thái đăng nhập
const isLoggedIn = checkLoginStatus();
```

### 3. **Auth State Listener** (`fe/src/hooks/useAuthStateListener.ts`)

```typescript
import { useAuthStateListener } from '@/hooks/useAuthStateListener';

useAuthStateListener({
  onLogin: () => {
    // Tự động refresh data khi đăng nhập
    fetchOrders();
    fetchCart();
  },
  onLogout: () => {
    // Clear data khi đăng xuất
    clearOrders();
    clearCart();
  }
});
```

### 4. **Auth Required Message Component** (`fe/src/components/common/AuthRequiredMessage.tsx`)

```typescript
import AuthRequiredMessage from '@/components/common/AuthRequiredMessage';

<AuthRequiredMessage 
  message="Vui lòng đăng nhập để xem đơn hàng"
  showLoginButton={true}
/>
```

## 🔧 Cách Sử Dụng Trong Các Hook

### useOrders Hook

```typescript
import { useOrders } from '@/hooks/useOrders';

const { orders, loading, error, fetchOrders } = useOrders();

// Hook tự động:
// - Kiểm tra authentication trước khi gọi API
// - Xử lý lỗi token không hợp lệ
// - Tự động refresh khi user đăng nhập
// - Clear data khi user đăng xuất
```

### useCart Hook

```typescript
import { useCart } from '@/hooks/useCart';

const { cart, loading, addToCart, removeFromCart } = useCart();

// Hook tự động:
// - Kiểm tra authentication trước mọi operation
// - Hiển thị thông báo lỗi phù hợp
// - Tự động refresh cart khi đăng nhập
```

### useBuyNow Hook

```typescript
import { useBuyNow } from '@/hooks/useBuyNow';

const { buyNow, loading, error } = useBuyNow();

// Hook tự động:
// - Kiểm tra authentication trước khi mua
// - Xử lý lỗi token hết hạn
// - Hiển thị thông báo lỗi bằng tiếng Việt
```

## 🎯 Các Trường Hợp Sử Dụng

### 1. **Trang Yêu Cầu Authentication**

```typescript
export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Trang được bảo vệ</h1>
        <AuthRequiredMessage 
          message="Vui lòng đăng nhập để truy cập trang này"
          showLoginButton={true}
        />
      </div>
    );
  }

  return <ProtectedContent />;
}
```

### 2. **API Call với Authentication Check**

```typescript
const handleApiCall = async () => {
  const result = await safeApiCall(
    async () => {
      return await api.getData();
    },
    (error) => {
      console.warn('Auth error:', error.message);
      // Có thể redirect hoặc hiển thị thông báo
    }
  );

  if (result) {
    // Xử lý data
    setData(result);
  } else {
    // User chưa đăng nhập hoặc token không hợp lệ
    setMessage('Vui lòng đăng nhập để tiếp tục');
  }
};
```

### 3. **Component với Auto Refresh**

```typescript
export default function OrdersPage() {
  const { orders, fetchOrders } = useOrders();

  // Tự động refresh khi user đăng nhập
  useAuthStateListener({
    onLogin: fetchOrders,
    onLogout: () => setOrders([])
  });

  return (
    <div>
      <h1>Đơn hàng của tôi</h1>
      {orders.map(order => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}
```

## 🛠️ Cấu Hình và Tùy Chỉnh

### 1. **Custom Error Messages**

```typescript
// Trong authUtils.ts
export const AUTH_ERROR_MESSAGES = {
  NOT_LOGGED_IN: 'Vui lòng đăng nhập để tiếp tục',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  INVALID_TOKEN: 'Token không hợp lệ',
  UNAUTHORIZED: 'Bạn không có quyền truy cập'
};
```

### 2. **Custom Auth Check Logic**

```typescript
// Tùy chỉnh logic kiểm tra authentication
export const customAuthCheck = () => {
  const token = getAuthToken();
  const userRole = localStorage.getItem('userRole');
  
  return token && userRole === 'USER';
};
```

### 3. **Auto Redirect Configuration**

```typescript
// Trong useAuthStateListener
useAuthStateListener({
  onLogout: () => {
    // Tự động redirect về trang chủ khi đăng xuất
    window.location.href = '/';
  }
});
```

## 📊 Lợi Ích Đạt Được

### ✅ **Trước Khi Cải Tiến**
- ❌ Lỗi "Failed to fetch" khi token không hợp lệ
- ❌ Lỗi "Token không hợp lệ" hiển thị cho user
- ❌ API calls không cần thiết khi chưa đăng nhập
- ❌ Data không được clear khi đăng xuất
- ❌ Không có thông báo rõ ràng cho user

### ✅ **Sau Khi Cải Tiến**
- ✅ Không còn lỗi "Failed to fetch"
- ✅ Xử lý graceful cho lỗi authentication
- ✅ Chỉ gọi API khi user đã đăng nhập
- ✅ Tự động clear data khi đăng xuất
- ✅ Thông báo rõ ràng bằng tiếng Việt
- ✅ Tự động refresh data khi đăng nhập
- ✅ Type-safe với TypeScript
- ✅ Consistent across toàn bộ ứng dụng

## 🧪 Testing

### Test Authentication Flow

```typescript
import { AuthCheckExample } from '@/components/common/AuthCheckExample';

// Component để test các trường hợp authentication
<AuthCheckExample />
```

### Test Error Handling

```typescript
// Test với token không hợp lệ
localStorage.setItem('token', 'invalid-token');
// Gọi API và kiểm tra xử lý lỗi

// Test khi chưa đăng nhập
localStorage.removeItem('token');
// Gọi API và kiểm tra thông báo
```

## 📝 Ghi Chú Quan Trọng

1. **Tất cả API calls** đều phải sử dụng `safeApiCall` hoặc `withAuthCheck`
2. **Components yêu cầu auth** nên sử dụng `AuthRequiredMessage`
3. **Hooks cần auto-refresh** nên sử dụng `useAuthStateListener`
4. **Error messages** nên bằng tiếng Việt để user-friendly
5. **Token cleanup** được tự động xử lý khi không hợp lệ

## 🔄 Migration Guide

### Từ Code Cũ

```typescript
// ❌ Code cũ
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    api.getData() // Có thể gây lỗi
      .then(data => setData(data))
      .catch(error => console.error(error));
  }
}, []);
```

### Sang Code Mới

```typescript
// ✅ Code mới
useEffect(() => {
  if (isLoggedIn()) {
    safeApiCall(
      () => api.getData(),
      (error) => console.warn('Auth error:', error.message)
    ).then(result => {
      if (result) setData(result);
    });
  }
}, []);
```

Giải pháp này đảm bảo ứng dụng của bạn sẽ không còn gặp các lỗi authentication và cung cấp trải nghiệm người dùng tốt hơn! 🎉 