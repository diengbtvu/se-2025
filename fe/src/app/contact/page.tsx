"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// GoogleMap Component - Phiên bản đơn giản
const GoogleMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // useEffect(() => {
  //   // Simulate loading delay
  //   const timer = setTimeout(() => {
  //     setMapError(true);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="h-[400px] bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
      {!mapLoaded && !mapError && (
        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#65BD60] mx-auto mb-4"></div>
            <p>Đang tải bản đồ...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <p className="font-medium mb-2">Bản đồ tạm thời không khả dụng</p>
            <p className="text-sm mb-4">Vui lòng thử lại sau</p>
            <a 
              href="https://maps.app.goo.gl/oiLfBFuEuYLSJ8RR8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#65BD60] text-white rounded-lg hover:bg-[#4e9749] transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Xem trên Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Career hero.webp"
            alt="Contact BeeLife"
            width={1920}
            height={1080}
            className="object-cover w-full h-full brightness-50"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Hãy để chúng tôi hỗ trợ bạn xây dựng trang trại ong thông minh
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[#ECF1E5] p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-8 text-[#4E4540]">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                    required
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="product">Tư vấn sản phẩm</option>
                    <option value="service">Dịch vụ</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#65BD60] hover:bg-[#4e9749] text-white px-6 py-3 rounded-full font-semibold transition-all"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#4E4540]">
                Thông tin liên hệ
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Link.svg"
                      alt="Location"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Địa chỉ</h3>
                    <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Link (1).svg"
                      alt="Phone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Điện thoại</h3>
                    <p className="text-gray-600">+84 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Link (2).svg"
                      alt="Email"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">info@beelife.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Link (1).svg"
                      alt="Working Hours"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Giờ làm việc</h3>
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-8 text-[#4E4540]">
                  Bản đồ
                </h2>
                <GoogleMap />
                <div className="mt-4 text-sm text-gray-600 text-center">
                  <p>📍 W8FW+9J Trà Vinh, Tỉnh Trà Vinh, Việt Nam</p>
                  <p className="mt-1">Click vào bản đồ để xem thông tin chi tiết</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 