"use client";

import Image from "next/image";
import Link from "next/link";

export default function Growers() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/olam almond acres initiative.jpg"
            alt="Growers Hero"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Giải pháp cho nhà nông
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-white/90">
            Tối ưu hóa năng suất cây trồng với dịch vụ thụ phấn thông minh
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Lợi ích cho nhà nông
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/timeGreen-1.svg"
                  alt="Productivity Icon"
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Tăng năng suất</h3>
              <p className="text-gray-600">
                Thụ phấn hiệu quả giúp tăng năng suất cây trồng lên đến 30%
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/experience.svg"
                  alt="Quality Icon"
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Chất lượng cao</h3>
              <p className="text-gray-600">
                Cải thiện chất lượng và kích thước của nông sản
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/Tree.svg"
                  alt="Sustainability Icon"
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Bền vững</h3>
              <p className="text-gray-600">
                Phương pháp canh tác thân thiện với môi trường
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Quy trình làm việc
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Image
                src="/images/fits into existing workflows.webp"
                alt="Work Process"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Khảo sát</h3>
                    <p className="text-gray-600">
                      Đánh giá diện tích và loại cây trồng cần thụ phấn
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Lập kế hoạch</h3>
                    <p className="text-gray-600">
                      Xây dựng phương án thụ phấn tối ưu cho từng loại cây
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Triển khai</h3>
                    <p className="text-gray-600">
                      Bố trí và quản lý đàn ong theo kế hoạch
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Theo dõi</h3>
                    <p className="text-gray-600">
                      Giám sát và báo cáo kết quả thụ phấn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-[#4E4540]">
            Sẵn sàng tăng năng suất cây trồng?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất cho trang trại của bạn
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Liên hệ ngay
            </Link>
            <Link
              href="/products"
              className="border-2 border-[#65BD60] text-[#65BD60] hover:bg-[#65BD60] hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 