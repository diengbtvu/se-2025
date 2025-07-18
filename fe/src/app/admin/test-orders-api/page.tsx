"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminAPI } from "@/services/adminAPI";

export default function TestOrdersAPIPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testGetOrders = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      console.log('Testing getOrdersPaginated...');
      const response = await adminAPI.getOrdersPaginated(0, 10);
      
      console.log('API Response:', response);
      
      setTestResult({
        success: true,
        response: response,
        responseType: typeof response,
        isArray: Array.isArray(response),
        hasContent: response && typeof response === 'object' && 'content' in response,
        contentLength: response?.content?.length || 0,
        firstOrder: response?.content?.[0] || response?.[0] || null,
        firstOrderId: response?.content?.[0]?.id || response?.[0]?.id || 'NO_ID'
      });
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateStatus = async () => {
    try {
      setLoading(true);
      
      // Lấy orders trước
      const ordersResponse = await adminAPI.getOrdersPaginated(0, 5);
      const orders = ordersResponse?.content || ordersResponse || [];
      const firstOrder = orders.find((order: any) => order.id);
      
      if (!firstOrder) {
        setTestResult({
          success: false,
          error: 'Không tìm thấy order nào có ID để test'
        });
        return;
      }
      
      console.log('Testing updateOrderStatus with order:', firstOrder);
      const result = await adminAPI.updateOrderStatus(firstOrder.id, 'PROCESSING', 'Test update from debug page');
      
      setTestResult({
        success: true,
        message: 'Update thành công',
        orderId: firstOrder.id,
        result: result
      });
      
    } catch (error) {
      console.error('Update test failed:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p>Vui lòng đăng nhập với tài khoản admin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">Test Orders API</h1>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
              <div className="space-x-4">
                <button
                  onClick={testGetOrders}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Đang test...' : 'Test Get Orders'}
                </button>
                <button
                  onClick={testUpdateStatus}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Đang test...' : 'Test Update Status'}
                </button>
              </div>
            </div>

            {testResult && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                
                {testResult.success ? (
                  <div className="space-y-4">
                    <div className="text-green-600 font-semibold">✅ Test thành công</div>
                    
                    {testResult.message && (
                      <div>
                        <strong>Message:</strong> {testResult.message}
                      </div>
                    )}
                    
                    {testResult.orderId && (
                      <div>
                        <strong>Order ID:</strong> {testResult.orderId}
                      </div>
                    )}
                    
                    {testResult.responseType && (
                      <div>
                        <strong>Response Type:</strong> {testResult.responseType}
                      </div>
                    )}
                    
                    {testResult.isArray !== undefined && (
                      <div>
                        <strong>Is Array:</strong> {testResult.isArray ? 'Yes' : 'No'}
                      </div>
                    )}
                    
                    {testResult.hasContent !== undefined && (
                      <div>
                        <strong>Has Content Property:</strong> {testResult.hasContent ? 'Yes' : 'No'}
                      </div>
                    )}
                    
                    {testResult.contentLength !== undefined && (
                      <div>
                        <strong>Content Length:</strong> {testResult.contentLength}
                      </div>
                    )}
                    
                    {testResult.firstOrderId && (
                      <div>
                        <strong>First Order ID:</strong> {testResult.firstOrderId}
                      </div>
                    )}
                    
                    {testResult.firstOrder && (
                      <div>
                        <strong>First Order:</strong>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                          {JSON.stringify(testResult.firstOrder, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {testResult.result && (
                      <div>
                        <strong>Update Result:</strong>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
                          {testResult.result}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-red-600 font-semibold">❌ Test thất bại</div>
                    <div>
                      <strong>Error:</strong> {testResult.error}
                    </div>
                  </div>
                )}
                
                {testResult.response && (
                  <div className="mt-4">
                    <strong>Full Response:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-60">
                      {JSON.stringify(testResult.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 