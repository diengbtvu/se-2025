"use client";

import { useState } from 'react';
import { API_CONFIG } from '@/config/api';

export default function TestAPI() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setTestResult(null);

    try {
      console.log('Testing login API...');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userName: 'hoangff',
          password: '123123'
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('Raw response:', text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      try {
        const json = JSON.parse(text);
        setTestResult(json);
        console.log('Parsed JSON:', json);
      } catch (parseError) {
        console.log('Not JSON, treating as text');
        setTestResult({ token: text, type: 'text' });
      }
    } catch (err) {
      console.error('Test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testProfile = async () => {
    setLoading(true);
    setError('');
    setTestResult(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }

      console.log('Testing profile API with token:', token);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);
      const text = await response.text();
      console.log('Profile raw response:', text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const json = JSON.parse(text);
      setTestResult(json);
    } catch (err) {
      console.error('Profile test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Login API</h2>
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Profile API</h2>
          <button
            onClick={testProfile}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Profile'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 