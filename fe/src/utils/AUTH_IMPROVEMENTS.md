# Authentication Improvements

## Overview
This document describes the authentication improvements made to fix the "Failed to fetch" error and provide better authentication handling throughout the application.

## Problem Solved
- **Error**: "Failed to fetch" when `getProfile()` was called without proper authentication
- **Root Cause**: The `useAuth` hook was trying to call `getProfile()` immediately when a token existed in localStorage, even if the token was invalid or expired
- **Solution**: Added authentication check functions and improved error handling

## New Authentication Utilities

### 1. `authUtils.ts` - Core Authentication Functions

#### `isLoggedIn()`
Simple function to check if user is currently logged in.
```typescript
import { isLoggedIn } from '@/utils/authUtils';

if (isLoggedIn()) {
  // User is logged in, safe to make API calls
} else {
  // User is not logged in, redirect to login
}
```

#### `getAuthToken()`
Get the current authentication token.
```typescript
import { getAuthToken } from '@/utils/authUtils';

const token = getAuthToken();
if (token) {
  // Use token for API calls
}
```

#### `withAuthCheck(callback, onNotAuthenticated?)`
Execute a function only if user is authenticated.
```typescript
import { withAuthCheck } from '@/utils/authUtils';

const result = await withAuthCheck(
  async () => {
    // This only runs if user is authenticated
    return await authAPI.getProfile();
  },
  () => {
    // This runs if user is not authenticated
    console.log('User not authenticated');
  }
);
```

#### `safeApiCall(apiCall, onAuthError?)`
Safely execute API calls with authentication error handling.
```typescript
import { safeApiCall } from '@/utils/authUtils';

const result = await safeApiCall(
  async () => {
    return await authAPI.getProfile();
  },
  (error) => {
    // Handle authentication errors gracefully
    console.warn('Auth error:', error.message);
  }
);
```

#### `clearAuthData()`
Clear all authentication data (logout utility).
```typescript
import { clearAuthData } from '@/utils/authUtils';

clearAuthData(); // Clears token, userRole, user from localStorage
```

### 2. Updated `useAuth` Hook

#### New Functions
- `checkLoginStatus()`: Returns boolean indicating if user is logged in
- `validateTokenAndGetProfile()`: Validates token and fetches profile safely

#### Improved Error Handling
- Token validation before making API calls
- Graceful handling of invalid/expired tokens
- Automatic cleanup of invalid authentication data

### 3. Updated Cart Hooks

#### `useCart` and `useCartCQRS`
- Added authentication checks before all cart operations
- Prevents API calls when user is not authenticated
- Better error messages for unauthenticated users

## Usage Examples

### Before (Problematic)
```typescript
// This could cause "Failed to fetch" error
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    authAPI.getProfile() // Could fail if token is invalid
      .then(user => setUser(user))
      .catch(error => console.error(error));
  }
}, []);
```

### After (Fixed)
```typescript
// Safe authentication check
useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const result = await validateTokenAndGetProfile(token);
      
      if (result.success) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          token,
          loading: false
        });
      } else {
        // Token is invalid, clear it
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  initializeAuth();
}, []);
```

### Using Authentication Utilities
```typescript
import { isLoggedIn, withAuthCheck, safeApiCall } from '@/utils/authUtils';

// Simple check
if (isLoggedIn()) {
  // Make API call
}

// With wrapper
const profile = await withAuthCheck(
  () => authAPI.getProfile(),
  () => redirectToLogin()
);

// Safe API call
const result = await safeApiCall(
  () => authAPI.getProfile(),
  (error) => handleAuthError(error)
);
```

## Benefits

1. **Prevents "Failed to fetch" errors**: API calls are only made when user is properly authenticated
2. **Better user experience**: Clear error messages and graceful handling of authentication failures
3. **Improved security**: Automatic cleanup of invalid tokens
4. **Consistent authentication handling**: Standardized approach across the application
5. **Type safety**: Full TypeScript support with proper error handling

## Testing

Use the `AuthCheckExample` component to test the authentication improvements:

```typescript
import { AuthCheckExample } from '@/components/common/AuthCheckExample';

// In your page/component
<AuthCheckExample />
```

This component demonstrates all three authentication check methods and shows how they handle different scenarios.

## New Components and Hooks

### 1. `AuthRequiredMessage` Component
Component để hiển thị thông báo khi user chưa đăng nhập:

```typescript
import AuthRequiredMessage from '@/components/common/AuthRequiredMessage';

<AuthRequiredMessage 
  message="Vui lòng đăng nhập để xem đơn hàng"
  showLoginButton={true}
/>
```

### 2. `useAuthStateListener` Hook
Hook để lắng nghe thay đổi trạng thái authentication:

```typescript
import { useAuthStateListener } from '@/hooks/useAuthStateListener';

useAuthStateListener({
  onLogin: () => {
    // Xử lý khi user đăng nhập
    fetchData();
  },
  onLogout: () => {
    // Xử lý khi user đăng xuất
    clearData();
  }
});
```

### 3. Updated Hooks
- **`useOrders`**: Đã được cập nhật với authentication checks
- **`useBuyNow`**: Đã được cập nhật với authentication checks
- **`useCart`**: Đã được cập nhật với authentication checks
- **`useCartCQRS`**: Đã được cập nhật với authentication checks

## Error Handling Improvements

### Before
```typescript
// Có thể gây lỗi "Token không hợp lệ"
const orders = await ordersAPI.getAll();
```

### After
```typescript
// Xử lý graceful khi token không hợp lệ
const result = await safeApiCall(
  async () => await ordersAPI.getAll(),
  (error) => {
    console.warn('Auth error:', error.message);
  }
);

if (result) {
  // Xử lý data
} else {
  // User chưa đăng nhập hoặc token không hợp lệ
}
```

## Benefits

1. **✅ Prevents "Failed to fetch" errors**: API calls are only made when user is properly authenticated
2. **✅ Better user experience**: Clear error messages and graceful handling of authentication failures
3. **✅ Improved security**: Automatic cleanup of invalid tokens
4. **✅ Consistent authentication handling**: Standardized approach across the application
5. **✅ Type safety**: Full TypeScript support with proper error handling
6. **✅ Auto-refresh on login**: Data automatically refreshes when user logs in
7. **✅ Clear data on logout**: Data is cleared when user logs out
8. **✅ User-friendly messages**: Clear Vietnamese messages for authentication states 