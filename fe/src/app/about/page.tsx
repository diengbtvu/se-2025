"use client";

import Image from "next/image";
import DriveImageWrapper from "@/components/DriveImageWrapper";
import DriveIcon from "@/components/DriveIcon";

export default function About() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Câu chuyện của BeeLife
              </h1>
              <p className="text-lg text-white/90 mb-6">
                BeeLife được thành lập với sứ mệnh mang đến những giải pháp nuôi ong hiện đại,
                kết hợp công nghệ tiên tiến với kinh nghiệm truyền thống để tạo ra một hệ sinh thái
                bền vững cho ngành ong mật Việt Nam.
              </p>
              <p className="text-lg text-white/90">
                Chúng tôi tin rằng, thông qua việc áp dụng công nghệ và đổi mới sáng tạo,
                chúng ta có thể nâng cao hiệu quả nuôi ong, bảo vệ môi trường và tạo ra
                những sản phẩm chất lượng cao cho người tiêu dùng.
              </p>
            </div>
            <div>
              <DriveImageWrapper
                imageName="team-high-five.jpg"
                alt="BeeLife Team"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                fallbackSrc="/images/team-high-five.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <DriveIcon
                  iconName="Bee.svg"
                  alt="Innovation Icon"
                  width={40}
                  height={40}
                  className="text-white"
                  fallbackSrc="/images/Bee.svg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Đổi mới sáng tạo</h3>
              <p className="text-gray-600">
                Không ngừng cải tiến và áp dụng công nghệ mới trong nuôi ong
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <DriveIcon
                  iconName="Tree.svg"
                  alt="Sustainability Icon"
                  width={40}
                  height={40}
                  className="text-white"
                  fallbackSrc="/images/Tree.svg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Phát triển bền vững</h3>
              <p className="text-gray-600">
                Cam kết bảo vệ môi trường và tạo ra giá trị lâu dài
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#65BD60] rounded-full flex items-center justify-center mx-auto mb-6">
                <DriveIcon
                  iconName="Join.svg"
                  alt="Community Icon"
                  width={40}
                  height={40}
                  className="text-white"
                  fallbackSrc="/images/Join.svg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Cộng đồng</h3>
              <p className="text-gray-600">
                Xây dựng mạng lưới người nuôi ong chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#ECF1E5]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Đội ngũ của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-6">
                <DriveImageWrapper
                  imageName="Vector (1).png"
                  alt="Team Member 1"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto"
                  fallbackSrc="/images/image 43.webp"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nguyễn Văn A</h3>
              <p className="text-gray-600">Giám đốc điều hành</p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <DriveImageWrapper
                  imageName="Vector (3).png"
                  alt="Team Member 2"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto"
                  fallbackSrc="/images/image 43-1.webp"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trần Thanh B</h3>
              <p className="text-gray-600">Giám đốc kỹ thuật</p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <DriveImageWrapper
                  imageName="Vector (6).png"
                  alt="Team Member 3"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto"
                  fallbackSrc="/images/image 43 (1)-1.webp"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lê Văn C</h3>
              <p className="text-gray-600">Trưởng phòng R&D</p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <DriveImageWrapper
                  imageName="Vector (5).png"
                  alt="Team Member 4"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto"
                  fallbackSrc="/images/image 43 (2)-1.webp"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phạm Thị D</h3>
              <p className="text-gray-600">Quản lý sản xuất</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 