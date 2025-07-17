// Authentication utility functions

/**
 * Check if user is currently logged in by checking for token in localStorage
 * @returns boolean indicating if user is logged in
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false; // SSR check
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get the current authentication token
 * @returns token string or null if not logged in
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null; // SSR check
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated before making API calls
 * @param callback Function to execute if user is authenticated
 * @param onNotAuthenticated Function to execute if user is not authenticated (optional)
 * @returns Promise that resolves with the result of callback or rejects if not authenticated
 */
export const withAuthCheck = async <T>(
  callback: () => Promise<T>,
  onNotAuthenticated?: () => void
): Promise<T> => {
  if (!isLoggedIn()) {
    if (onNotAuthenticated) {
      onNotAuthenticated();
    }
    throw new Error('User not authenticated');
  }
  return callback();
};

/**
 * Safely execute an API call with authentication check
 * @param apiCall Function that makes the API call
 * @param onAuthError Function to handle authentication errors (optional)
 * @returns Promise that resolves with API response or handles auth errors gracefully
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  onAuthError?: (error: Error) => void
): Promise<T | null> => {
  try {
    if (!isLoggedIn()) {
      console.warn('User not authenticated, skipping API call');
      return null;
    }
    return await apiCall();
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's an authentication error
      if (error.message.includes('Token') || 
          error.message.includes('Unauthorized') || 
          error.message.includes('401')) {
        console.warn('Authentication error:', error.message);
        // Clear invalid token
        localStorage.removeItem('token');
        if (onAuthError) {
          onAuthError(error);
        }
        return null;
      }
    }
    throw error;
  }
};

/**
 * Clear authentication data (logout utility)
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return; // SSR check
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('user');
}; 