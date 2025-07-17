'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isLoggedIn, withAuthCheck, safeApiCall } from '@/utils/authUtils';
import { authAPI } from '@/services/api';

export const AuthCheckExample = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [profileData, setProfileData] = useState<any>(null);

  // Example 1: Simple login check
  const handleSimpleCheck = () => {
    if (isLoggedIn()) {
      setMessage('✅ User is logged in - safe to make API calls');
    } else {
      setMessage('❌ User is not logged in - redirect to login page');
    }
  };

  // Example 2: Using withAuthCheck wrapper
  const handleWithAuthCheck = async () => {
    try {
      const result = await withAuthCheck(
        async () => {
          // This will only execute if user is authenticated
          const profile = await authAPI.getProfile();
          return profile;
        },
        () => {
          // This will execute if user is not authenticated
          setMessage('❌ User not authenticated - please login first');
        }
      );
      
      setProfileData(result);
      setMessage('✅ Profile fetched successfully with auth check');
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Example 3: Using safeApiCall wrapper
  const handleSafeApiCall = async () => {
    const result = await safeApiCall(
      async () => {
        // This API call will be skipped if user is not authenticated
        return await authAPI.getProfile();
      },
      (error) => {
        // Handle authentication errors gracefully
        console.warn('Auth error handled:', error.message);
        setMessage('❌ Authentication error - token may be invalid');
      }
    );

    if (result) {
      setProfileData(result);
      setMessage('✅ Profile fetched safely');
    } else {
      setMessage('ℹ️ API call skipped - user not authenticated');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Authentication Check Examples</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current Status: {loading ? 'Loading...' : (isAuthenticated ? '✅ Logged In' : '❌ Not Logged In')}
        </p>
        {user && (
          <p className="text-sm text-gray-600">
            User: {user.name} ({user.userName})
          </p>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSimpleCheck}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Simple Login Check
        </button>

        <button
          onClick={handleWithAuthCheck}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          With Auth Check Wrapper
        </button>

        <button
          onClick={handleSafeApiCall}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Safe API Call
        </button>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{message}</p>
        </div>
      )}

      {profileData && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <h3 className="font-semibold text-sm">Profile Data:</h3>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}; 