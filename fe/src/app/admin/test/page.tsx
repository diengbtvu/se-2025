"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminAPI } from "@/services/adminAPI";

export default function AdminTest() {
  const { isAuthenticated, user, loading } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const runTests = async () => {
      let result = '';
      
      // Test 1: Check authentication
      result += `=== AUTHENTICATION TEST ===\n`;
      result += `isAuthenticated: ${isAuthenticated}\n`;
      result += `loading: ${loading}\n`;
      result += `user: ${JSON.stringify(user, null, 2)}\n`;
      
      // Test 2: Check token
      const token = localStorage.getItem('token');
      result += `\n=== TOKEN TEST ===\n`;
      result += `Token in localStorage: ${token}\n`;
      result += `Token length: ${token ? token.length : 0}\n`;
      
      // Test 3: Check user role
      result += `\n=== ROLE TEST ===\n`;
      result += `User role: ${user?.role}\n`;
      result += `Is admin: ${user?.role === 'ADMIN'}\n`;
      
      // Test 4: Test API call
      if (isAuthenticated && user?.role === 'ADMIN') {
        result += `\n=== API TEST ===\n`;
        try {
          const response = await adminAPI.getDashboardStats();
          result += `API Response: ${JSON.stringify(response, null, 2)}\n`;
        } catch (error) {
          result += `API Error: ${error}\n`;
        }
      } else {
        result += `\n=== API TEST ===\n`;
        result += `Skipped - not authenticated or not admin\n`;
      }
      
      setTestResult(result);
    };

    if (!loading) {
      runTests();
    }
  }, [isAuthenticated, loading, user]);

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">
            Admin Test Page
          </h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#4E4540] mb-4">
              Debug Information
            </h2>
            
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
              {testResult || 'Loading...'}
            </pre>
          </div>
          
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#4E4540] mb-4">
              Manual Tests
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={async () => {
                  try {
                    const response = await adminAPI.getDashboardStats();
                    alert(`Success: ${JSON.stringify(response)}`);
                  } catch (error) {
                    alert(`Error: ${error}`);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Test Dashboard API
              </button>
              
              <button
                onClick={async () => {
                  try {
                    const response = await adminAPI.getActiveUsers();
                    alert(`Success: ${JSON.stringify(response)}`);
                  } catch (error) {
                    alert(`Error: ${error}`);
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Test Active Users API
              </button>
              
              <button
                onClick={() => {
                  const token = localStorage.getItem('token');
                  alert(`Token: ${token}`);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Show Token
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userRole');
                  alert('Token cleared');
                  window.location.reload();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Clear Token & Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 