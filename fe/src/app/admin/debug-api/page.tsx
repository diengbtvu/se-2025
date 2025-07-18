"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function DebugAPIPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '');
    }
  }, []);

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const url = `${baseURL}${endpoint}`;
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      console.log(`Testing ${method} ${url}`);
      console.log('Headers:', headers);
      if (body) console.log('Body:', body);

      const response = await fetch(url, options);
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        status: 'Network Error'
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    const results: any = {};

    // Test 1: Dashboard API
    results.dashboard = await testAPI('/api/admin/dashboard');

    // Test 2: Active Users API
    results.activeUsers = await testAPI('/api/admin/active-users');

    // Test 3: Products API
    results.products = await testAPI('/api/admin/products?page=0&size=5');

    // Test 4: Orders API
    results.orders = await testAPI('/api/admin/orders?page=0&size=5');

    // Test 5: Users API
    results.users = await testAPI('/api/admin/users/paginated?page=0&size=5');

    setTestResults(results);
    setLoading(false);
  };

  const testSpecificAPI = async (endpoint: string) => {
    setLoading(true);
    const result = await testAPI(endpoint);
    setTestResults({ [endpoint]: result });
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60]"></div>
            <p className="mt-4 text-gray-600">Đang test API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">Debug API Calls</h1>
          
          {/* Authentication Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
                <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
                <p><strong>Username:</strong> {user?.userName || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'No token'}</p>
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={runAllTests}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Test All APIs
              </button>
              <button
                onClick={() => testSpecificAPI('/api/admin/dashboard')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Test Dashboard
              </button>
              <button
                onClick={() => testSpecificAPI('/api/admin/active-users')}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Test Active Users
              </button>
              <button
                onClick={() => testSpecificAPI('/api/admin/products?page=0&size=5')}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Test Products
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {Object.entries(testResults).map(([key, result]: [string, any]) => (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()} API
                </h3>
                <div className={`p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <strong>Status:</strong> {result.success ? '✅ Success' : '❌ Failed'}
                    </div>
                    <div>
                      <strong>HTTP Status:</strong> {result.status}
                    </div>
                    <div>
                      <strong>Status Text:</strong> {result.statusText}
                    </div>
                  </div>
                  
                  {result.error && (
                    <div className="mb-4">
                      <strong>Error:</strong> 
                      <pre className="bg-red-50 p-2 rounded mt-1 text-sm">{result.error}</pre>
                    </div>
                  )}
                  
                  {result.data && (
                    <div>
                      <strong>Response Data:</strong>
                      <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto max-h-96">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.headers && (
                    <div className="mt-4">
                      <strong>Response Headers:</strong>
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                        {JSON.stringify(result.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(testResults).length === 0 && (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600">Chưa có kết quả test nào. Hãy click "Test All APIs" để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 