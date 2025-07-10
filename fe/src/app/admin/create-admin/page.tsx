"use client";

import { useState } from "react";
import { API_CONFIG } from "@/config/api";

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    userName: "admin",
    password: "admin123",
    name: "Admin User",
    phoneNumber: "0123456789",
    email: "admin@beelife.com"
  });
  const [result, setResult] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult('Đang tạo tài khoản...');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const text = await response.text();
      
      if (response.ok) {
        setResult(`✅ Tạo tài khoản thành công!\n\nThông tin đăng nhập:\nUsername: ${formData.userName}\nPassword: ${formData.password}\n\nLưu ý: Bạn cần cập nhật role thành ADMIN trong database.`);
      } else {
        setResult(`❌ Lỗi: ${text}`);
      }
    } catch (error) {
      setResult(`❌ Lỗi kết nối: ${error}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4E4540] mb-8">
            Tạo tài khoản Admin
          </h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#65BD60] focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#65BD60] hover:bg-[#4e9749] text-white py-3 px-6 rounded-lg font-semibold transition-all"
              >
                Tạo tài khoản Admin
              </button>
            </form>
          </div>
          
          {result && (
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#4E4540] mb-4">
                Kết quả
              </h2>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Hướng dẫn
            </h3>
            <ol className="text-blue-700 space-y-2 text-sm">
              <li>1. Điền thông tin tài khoản admin</li>
              <li>2. Click "Tạo tài khoản Admin"</li>
              <li>3. Sau khi tạo thành công, bạn cần cập nhật role thành "ADMIN" trong database</li>
              <li>4. Đăng nhập với tài khoản vừa tạo</li>
              <li>5. Truy cập trang admin: <code className="bg-blue-100 px-1 rounded">/admin</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 