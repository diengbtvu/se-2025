"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function GetStarted() {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Career hero.webp"
            alt="Get Started Hero"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Bắt đầu với BeeLife
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-white/90">
            Chỉ vài bước đơn giản để bắt đầu hành trình nuôi ong thông minh
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <div className={`text-lg font-semibold ${step >= 1 ? 'text-[#65BD60]' : 'text-gray-400'}`}>
                  Bước 1
                </div>
                <div className={`text-lg font-semibold ${step >= 2 ? 'text-[#65BD60]' : 'text-gray-400'}`}>
                  Bước 2
                </div>
                <div className={`text-lg font-semibold ${step >= 3 ? 'text-[#65BD60]' : 'text-gray-400'}`}>
                  Bước 3
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#65BD60] rounded-full transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-[#ECF1E5] rounded-2xl p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-[#4E4540] mb-8">
                    Thông tin cơ bản
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-[#4E4540] mb-8">
                    Chi tiết dự án
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="project-type" className="block text-gray-700 mb-2">
                        Loại dự án
                      </label>
                      <select
                        id="project-type"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                      >
                        <option value="">Chọn loại dự án</option>
                        <option value="farm">Trang trại nuôi ong</option>
                        <option value="urban">Nuôi ong đô thị</option>
                        <option value="pollination">Dịch vụ thụ phấn</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="scale" className="block text-gray-700 mb-2">
                        Quy mô dự kiến
                      </label>
                      <select
                        id="scale"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                      >
                        <option value="">Chọn quy mô</option>
                        <option value="small">Nhỏ (1-10 tổ)</option>
                        <option value="medium">Vừa (11-50 tổ)</option>
                        <option value="large">Lớn (50+ tổ)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-gray-700 mb-2">
                        Địa điểm
                      </label>
                      <input
                        type="text"
                        id="location"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                        placeholder="Tỉnh/Thành phố"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-[#4E4540] mb-8">
                    Xác nhận thông tin
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Thời gian liên hệ phù hợp
                      </label>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                      >
                        <option value="">Chọn thời gian</option>
                        <option value="morning">Buổi sáng (8:00 - 12:00)</option>
                        <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
                        <option value="evening">Buổi tối (18:00 - 20:00)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Ghi chú thêm
                      </label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#65BD60]"
                        rows={4}
                        placeholder="Nhập thông tin bổ sung nếu có"
                      ></textarea>
                    </div>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-gray-700">
                        Tôi đồng ý với các điều khoản và điều kiện của BeeLife
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border-2 border-[#65BD60] text-[#65BD60] rounded-full hover:bg-[#65BD60] hover:text-white transition-all"
                  >
                    Quay lại
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="ml-auto px-6 py-3 bg-[#65BD60] text-white rounded-full hover:bg-[#4e9749] transition-all"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    className="ml-auto px-6 py-3 bg-[#65BD60] text-white rounded-full hover:bg-[#4e9749] transition-all"
                  >
                    Hoàn tất
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#4E4540] mb-8">
              Cần hỗ trợ?
            </h2>
            <p className="text-gray-600 mb-8">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn
            </p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src="/images/Link (1).svg"
                    alt="Phone Icon"
                    width={32}
                    height={32}
                    className="text-white"
                  />
                </div>
                <p className="text-gray-600">Hotline: 1900 1234</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src="/images/Link (2).svg"
                    alt="Email Icon"
                    width={32}
                    height={32}
                    className="text-white"
                  />
                </div>
                <p className="text-gray-600">Email: support@beelife.vn</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 