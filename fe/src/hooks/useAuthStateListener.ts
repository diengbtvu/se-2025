import { useEffect, useRef } from 'react';
import { isLoggedIn } from '@/utils/authUtils';

interface UseAuthStateListenerOptions {
  onLogin?: () => void;
  onLogout?: () => void;
  onAuthChange?: (isAuthenticated: boolean) => void;
  autoRefreshOnLogin?: boolean;
}

/**
 * Hook để lắng nghe thay đổi trạng thái authentication
 * Tự động gọi callback khi user đăng nhập/đăng xuất
 */
export const useAuthStateListener = (options: UseAuthStateListenerOptions = {}) => {
  const {
    onLogin,
    onLogout,
    onAuthChange,
    autoRefreshOnLogin = true
  } = options;

  const lastAuthState = useRef<boolean>(isLoggedIn());

  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      const currentAuthState = event.detail?.isAuthenticated || false;
      const previousAuthState = lastAuthState.current;

      // Cập nhật trạng thái cuối cùng
      lastAuthState.current = currentAuthState;

      // Gọi callback tương ứng
      if (currentAuthState && !previousAuthState) {
        // User vừa đăng nhập
        console.log('User đã đăng nhập, refreshing data...');
        onLogin?.();
        
        if (autoRefreshOnLogin) {
          // Tự động refresh page data
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } else if (!currentAuthState && previousAuthState) {
        // User vừa đăng xuất
        console.log('User đã đăng xuất, clearing data...');
        onLogout?.();
      }

      // Gọi callback chung
      onAuthChange?.(currentAuthState);
    };

    // Lắng nghe sự kiện authStateChanged
    window.addEventListener('authStateChanged', handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange as EventListener);
    };
  }, [onLogin, onLogout, onAuthChange, autoRefreshOnLogin]);

  return {
    isAuthenticated: lastAuthState.current
  };
};

/**
 * Hook để tự động refresh data khi user đăng nhập
 */
export const useAutoRefreshOnAuth = (refreshCallback: () => void) => {
  useAuthStateListener({
    onLogin: refreshCallback,
    autoRefreshOnLogin: false
  });
};

/**
 * Hook để clear data khi user đăng xuất
 */
export const useClearDataOnLogout = (clearCallback: () => void) => {
  useAuthStateListener({
    onLogout: clearCallback
  });
}; 