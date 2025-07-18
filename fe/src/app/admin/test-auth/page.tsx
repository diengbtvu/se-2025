"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminAPI } from "@/services/adminAPI";

export default function TestAuthPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check authentication state
      results.authState = {
        isAuthenticated,
        user,
        loading: authLoading,
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
      };

      // Test 2: Test dashboard API
      try {
        const dashboardData = await adminAPI.getDashboardStats();
        results.dashboard = { success: true, data: dashboardData };
      } catch (error: any) {
        results.dashboard = { 
          success: false, 
          error: error.message,
          status: error.message.includes('403') ? 'Forbidden' : 'Other'
        };
      }

      // Test 3: Test active users API
      try {
        const activeUsersData = await adminAPI.getActiveUsers();
        results.activeUsers = { success: true, data: activeUsersData };
      } catch (error: any) {
        results.activeUsers = { 
          success: false, 
          error: error.message,
          status: error.message.includes('403') ? 'Forbidden' : 'Other'
        };
      }

      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      runTests();
    }
  }, [isAuthenticated, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Chưa đăng nhập</h1>
            <p>Vui lòng đăng nhập để test authentication.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">Test Authentication & Admin APIs</h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Đang test...' : 'Chạy test lại'}
            </button>
          </div>

          <div className="space-y-6">
            {/* Authentication State */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.authState || {}, null, 2)}
              </pre>
            </div>

            {/* Dashboard API Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard API Test</h2>
              <div className={`p-4 rounded ${testResults.dashboard?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-semibold">
                  Status: {testResults.dashboard?.success ? '✅ Success' : '❌ Failed'}
                </p>
                {testResults.dashboard?.error && (
                  <p className="text-red-600 mt-2">Error: {testResults.dashboard.error}</p>
                )}
                {testResults.dashboard?.data && (
                  <pre className="mt-2 bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(testResults.dashboard.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Active Users API Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Active Users API Test</h2>
              <div className={`p-4 rounded ${testResults.activeUsers?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-semibold">
                  Status: {testResults.activeUsers?.success ? '✅ Success' : '❌ Failed'}
                </p>
                {testResults.activeUsers?.error && (
                  <p className="text-red-600 mt-2">Error: {testResults.activeUsers.error}</p>
                )}
                {testResults.activeUsers?.data && (
                  <pre className="mt-2 bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(testResults.activeUsers.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
              <div className="space-y-2">
                <p><strong>User Role:</strong> {user?.role}</p>
                <p><strong>Token Format:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 
                  `Bearer ${localStorage.getItem('token')?.substring(0, 20)}...` : 'No token'}</p>
                <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 