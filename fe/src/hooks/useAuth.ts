import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { UserAccountDTO, ProfileResponse } from '@/types/api';

interface AuthState {
  isAuthenticated: boolean;
  user: ProfileResponse | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.setToken(token);
      // Try to get user profile
      authAPI.getProfile()
        .then((user: ProfileResponse) => {
          setAuthState({
            isAuthenticated: true,
            user,
            token,
            loading: false
          });
        })
        .catch(() => {
          // Token is invalid, clear it
          authAPI.clearToken();
          localStorage.removeItem('token');
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false
          });
        });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (userName: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    return authAPI.login(userName, password)
      .then(loginResponse => {
        console.log('Login response received:', loginResponse);
        
        // Set authentication state immediately after successful login
        setAuthState({
          isAuthenticated: true,
          user: null, // Will be fetched later if needed
          token: loginResponse.token || loginResponse, // Handle both object and string response
          loading: false
        });
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: true, user: null } 
        }));
        
        // Try to get profile in background (optional)
        authAPI.getProfile()
          .then(user => {
            console.log('Profile fetched successfully:', user);
            setAuthState(prev => ({ ...prev, user }));
          })
          .catch(profileError => {
            console.warn('Could not fetch profile, but login was successful:', profileError);
            // Don't fail login if profile fetch fails
          });
        
        return { success: true, user: null };
      })
      .catch(error => {
        console.error('Login failed:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
      });
  };

  const register = (userData: UserAccountDTO) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    return authAPI.register(userData)
      .then(message => {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: true, message };
      })
      .catch(error => {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
      });
  };

  const logout = () => {
    authAPI.clearToken();
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
    
    // Trigger a custom event to notify other components (like useCart)
    window.dispatchEvent(new CustomEvent('authStateChanged', { 
      detail: { isAuthenticated: false, user: null } 
    }));
  };

  const refreshProfile = () => {
    return authAPI.getProfile()
      .then(user => {
        setAuthState(prev => ({ ...prev, user }));
        return { success: true, user };
      })
      .catch(error => {
        logout();
        return { success: false, error: error instanceof Error ? error.message : 'Failed to refresh profile' };
      });
  };

  const updateProfile = (profileData: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  }) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    return authAPI.updateProfile(profileData)
      .then(updatedUser => {
        setAuthState(prev => ({ 
          ...prev, 
          user: updatedUser,
          loading: false 
        }));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: true, user: updatedUser } 
        }));
        
        return { success: true, user: updatedUser };
      })
      .catch(error => {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' };
      });
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile
  };
}; 