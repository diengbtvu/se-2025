"use client";

import Image from "next/image";
import Link from "next/link";

export default function Beekeepers() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Untitled design (52).png"
            alt="Beekeepers Hero"
            width={1920}
            height={1080}
            className="object-cover w-full h-full brightness-50"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Nuôi ong chuyên nghiệp
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-white/90">
            Giải pháp toàn diện cho người nuôi ong hiện đại
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#ECF1E5] rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="mb-6">
                <Image
                  src="/images/monitors your colonies 24_7-min.webp"
                  alt="Monitoring"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#4E4540]">Giám sát thông minh</h3>
              <p className="text-gray-600">
                Theo dõi hoạt động đàn ong 24/7 với công nghệ IoT tiên tiến
              </p>
            </div>
            <div className="bg-[#ECF1E5] rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="mb-6">
                <Image
                  src="/images/provides a better bee habitat-min.webp"
                  alt="Management"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#4E4540]">Quản lý hiệu quả</h3>
              <p className="text-gray-600">
                Tối ưu hóa quy trình nuôi ong với dữ liệu thời gian thực
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Lợi ích khi sử dụng BeeLife
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/Bee.svg"
                  alt="Health Icon"
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Sức khỏe đàn ong</h3>
              <p className="text-gray-600">
                Phát hiện sớm và ngăn ngừa bệnh tật, đảm bảo đàn ong khỏe mạnh
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/experience.svg"
                  alt="Productivity Icon"
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Tăng năng suất</h3>
              <p className="text-gray-600">
                Tối ưu hóa quy trình nuôi ong, tăng sản lượng mật thu hoạch
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/images/timeGreen-1.svg"
                  alt="Time Icon"
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Tiết kiệm thời gian</h3>
              <p className="text-gray-600">
                Tự động hóa các công việc thường xuyên, giảm thời gian quản lý
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-[#4E4540]">
                Hỗ trợ toàn diện
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Beekeeper.svg"
                      alt="Training Icon"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Đào tạo</h3>
                    <p className="text-gray-600">
                      Chương trình đào tạo chuyên sâu về kỹ thuật nuôi ong hiện đại
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Link (2).svg"
                      alt="Support Icon"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tư vấn kỹ thuật</h3>
                    <p className="text-gray-600">
                      Đội ngũ chuyên gia hỗ trợ 24/7 qua điện thoại và trực tuyến
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#65BD60] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/Join.svg"
                      alt="Community Icon"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cộng đồng</h3>
                    <p className="text-gray-600">
                      Kết nối với cộng đồng người nuôi ong để chia sẻ kinh nghiệm
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/images/team-high-five.jpg"
                alt="Support Team"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-[#4E4540]">
            Bắt đầu hành trình nuôi ong thông minh
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Hãy để chúng tôi đồng hành cùng bạn trong việc phát triển trang trại ong chuyên nghiệp
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Liên hệ tư vấn
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
 