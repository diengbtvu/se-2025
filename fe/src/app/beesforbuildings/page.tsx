"use client";

import Image from "next/image";
import DriveImageWrapper from "@/components/DriveImageWrapper";
import DriveIcon from "@/components/DriveIcon";
import Link from "next/link";

export default function BeesForBuildings() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <DriveImageWrapper
            imageName="blueberry honey bees-1.webp"
            alt="Bees For Buildings Hero"
            width={1920}
            height={1080}
            className="object-cover w-full h-full brightness-50"
            priority
            fallbackSrc="/images/blueberry honey bees-1.webp"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Nuôi ong đô thị
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-white/90">
            Giải pháp nuôi ong bền vững cho không gian đô thị
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-[#4E4540]">
                Tại sao nuôi ong trong đô thị?
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Nuôi ong trong đô thị không chỉ là xu hướng mới mà còn là giải pháp
                  thiết thực cho vấn đề môi trường và an ninh lương thực đô thị.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                      <DriveIcon
                        iconName="Tree.svg"
                        alt="Environment Icon"
                        width={24}
                        height={24}
                        className="text-white"
                        fallbackSrc="/images/Tree.svg"
                      />
                    </div>
                    <p className="text-gray-700">Cải thiện đa dạng sinh học đô thị</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                      <DriveIcon
                        iconName="Grower.svg"
                        alt="Garden Icon"
                        width={24}
                        height={24}
                        className="text-white"
                        fallbackSrc="/images/Grower.svg"
                      />
                    </div>
                    <p className="text-gray-700">Hỗ trợ thụ phấn cho vườn đô thị</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                      <DriveIcon
                        iconName="Join.svg"
                        alt="Community Icon"
                        width={24}
                        height={24}
                        className="text-white"
                        fallbackSrc="/images/Join.svg"
                      />
                    </div>
                    <p className="text-gray-700">Tạo cộng đồng xanh bền vững</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <DriveImageWrapper
                imageName="Untitled design (22).webp"
                alt="Urban Beekeeping"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                fallbackSrc="/images/bee vaccine-1.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Giải pháp của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <DriveIcon
                  iconName="Bee.svg"
                  alt="Hive Icon"
                  width={32}
                  height={32}
                  className="text-white"
                  fallbackSrc="/images/Bee.svg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Tổ ong thông minh</h3>
              <p className="text-gray-600 text-center">
                Thiết kế đặc biệt phù hợp với không gian đô thị, tích hợp công nghệ giám sát
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                  <DriveIcon
                    iconName="experience.svg"
                  alt="Training Icon"
                  width={32}
                  height={32}
                  className="text-white"
                    fallbackSrc="/images/experience.svg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Đào tạo chuyên sâu</h3>
              <p className="text-gray-600 text-center">
                Chương trình đào tạo toàn diện về kỹ thuật nuôi ong trong môi trường đô thị
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                  <DriveIcon
                    iconName="Link (2).svg"
                  alt="Support Icon"
                  width={32}
                  height={32}
                  className="text-white"
                    fallbackSrc="/images/Link (2).svg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Hỗ trợ liên tục</h3>
              <p className="text-gray-600 text-center">
                Đội ngũ chuyên gia sẵn sàng hỗ trợ 24/7 cho mọi vấn đề phát sinh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Tính năng đặc biệt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#ECF1E5] rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">An toàn tối đa</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Hệ thống kiểm soát đàn ong thông minh</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Thiết kế ngăn ngừa xung đột với con người</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Cảnh báo sớm các vấn đề tiềm ẩn</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#ECF1E5] rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Tích hợp công nghệ</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Giám sát từ xa qua ứng dụng di động</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Phân tích dữ liệu môi trường thời gian thực</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Tự động điều chỉnh điều kiện tổ ong</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-[#4E4540]">
            Sẵn sàng đóng góp cho môi trường đô thị?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Hãy cùng chúng tôi xây dựng một hệ sinh thái đô thị bền vững thông qua nuôi ong thông minh
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Bắt đầu ngay
            </Link>
            <Link
              href="/products"
              className="border-2 border-[#65BD60] text-[#65BD60] hover:bg-[#65BD60] hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 