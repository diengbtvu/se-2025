"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FacebookIcon, YouTubeIcon, LinkedInIcon, InstagramIcon } from "@/components/icons/SocialIcons";

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// YouTube component
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full pt-[56.25%]">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default function Impact() {
  const [activeTab, setActiveTab] = useState("environmental");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full brightness-50"
          >
            <source src="/videos/blur.mp4" type="video/mp4" />
          </video>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="container relative z-10 text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Tác động của chúng tôi
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Xây dựng tương lai bền vững cho ngành nuôi ong và nông nghiệp
          </p>
          <button className="btn-primary">
            Khám phá ngay
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div 
            variants={staggerContainer}
            className="grid-auto-fill"
          >
            {[
              {
                value: "5000+",
                label: "Tổ ong được quản lý",
                icon: "/images/Bee.svg",
                detail: "Hệ thống quản lý thông minh 24/7",
                color: "#FFD700"
              },
              {
                value: "1000+",
                label: "Nông dân được hỗ trợ",
                icon: "/images/Grower.svg",
                detail: "Đào tạo và hỗ trợ kỹ thuật",
                color: "#65BD60"
              },
              {
                value: "30%",
                label: "Tăng năng suất cây trồng",
                icon: "/images/Tree.svg",
                detail: "Thông qua thụ phấn hiệu quả",
                color: "#4E4540"
              },
              {
                value: "95%",
                label: "Tỷ lệ sống của đàn ong",
                icon: "/images/experience.svg",
                detail: "Nhờ công nghệ chăm sóc tiên tiến",
                color: "#FFA500"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="card card-hover p-8"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: stat.color }}
                >
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={32}
                    height={32}
                    className="text-white"
                  />
                </div>
                <h3 
                  className="text-4xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h3>
                <h4 className="font-semibold mb-2">{stat.label}</h4>
                <p className="text-sm">{stat.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-2 text-center mb-16"
          >
            Câu chuyện của chúng tôi
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card p-8">
              <YouTubeEmbed videoId="VIDEO_ID_1" />
              <h3 className="heading-3 mt-8 mb-4">Hành trình phát triển</h3>
              <p className="paragraph">
                Khám phá câu chuyện về cách chúng tôi đang thay đổi ngành nuôi ong
                và nông nghiệp thông qua công nghệ và sự đổi mới.
              </p>
              <button className="btn-primary mt-6">
                Xem thêm
              </button>
            </div>
            <div className="card p-8">
              <YouTubeEmbed videoId="VIDEO_ID_2" />
              <h3 className="heading-3 mt-8 mb-4">Tác động xã hội</h3>
              <p className="paragraph">
                Tìm hiểu về cách chúng tôi đang tạo ra sự thay đổi tích cực
                trong cộng đồng nông nghiệp Việt Nam.
              </p>
              <button className="btn-primary mt-6">
                Xem thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="heading-2 text-center mb-16">Các lĩnh vực tác động</h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 space-x-4">
            {[
              { id: "environmental", label: "Môi trường" },
              { id: "social", label: "Xã hội" },
              { id: "economic", label: "Kinh tế" }
            ].map((tab, index) => (
              <button
                key={tab.id || `tab-${index}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 font-semibold rounded-full transition-all ${
                  activeTab === tab.id
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="card p-8">
            {activeTab === "environmental" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div className="relative h-[400px]">
                  <Image
                    src="/images/provides a better bee habitat-min.webp"
                    alt="Environmental Impact"
                    width={600}
                    height={400}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="heading-3">Tác động môi trường</h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Bảo tồn đa dạng sinh học",
                        desc: "Duy trì và phát triển quần thể ong, góp phần bảo vệ hệ sinh thái"
                      },
                      {
                        title: "Giảm thiểu carbon",
                        desc: "Áp dụng công nghệ xanh trong nuôi ong và sản xuất"
                      },
                      {
                        title: "Bảo vệ nguồn nước",
                        desc: "Quản lý tài nguyên nước hiệu quả trong hoạt động sản xuất"
                      }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        variants={fadeIn}
                        className="flex items-start gap-4"
                      >
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                          <span className="text-white">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "social" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <h3 className="heading-3">Tác động xã hội</h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Tạo việc làm",
                        desc: "Cung cấp cơ hội việc làm và thu nhập ổn định cho cộng đồng địa phương"
                      },
                      {
                        title: "Phát triển kỹ năng",
                        desc: "Đào tạo và nâng cao năng lực cho người nuôi ong và nông dân"
                      },
                      {
                        title: "Bình đẳng giới",
                        desc: "Thúc đẩy sự tham gia bình đẳng của phụ nữ trong nông nghiệp"
                      }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        variants={fadeIn}
                        className="flex items-start gap-4"
                      >
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                          <span className="text-white">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-[400px]">
                  <Image
                    src="/images/team-high-five.jpg"
                    alt="Social Impact"
                    width={600}
                    height={400}
                    className="object-cover rounded-lg"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "economic" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div className="relative h-[400px]">
                  <Image
                    src="/images/Untitled design (22).webp"
                    alt="Economic Impact"
                    width={600}
                    height={400}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="heading-3">Tác động kinh tế</h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Tăng thu nhập",
                        desc: "Cải thiện thu nhập cho người nuôi ong và nông dân thông qua công nghệ"
                      },
                      {
                        title: "Phát triển chuỗi giá trị",
                        desc: "Xây dựng chuỗi giá trị bền vững từ người nuôi ong đến người tiêu dùng"
                      },
                      {
                        title: "Đổi mới công nghệ",
                        desc: "Thúc đẩy chuyển đổi số trong nông nghiệp và nuôi ong"
                      }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        variants={fadeIn}
                        className="flex items-start gap-4"
                      >
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                          <span className="text-white">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="heading-2 text-center mb-16">Câu chuyện thành công</h2>
          <div className="grid-auto-fit">
            {[
              {
                name: "Anh Nguyễn Văn A",
                role: "Nông dân tại Đắk Lắk",
                image: "Vector (3).png",
                quote: "Nhờ BeeLife, năng suất cà phê của tôi đã tăng 40% sau một năm."
              },
              {
                name: "Chị Trần Thị B",
                role: "Chủ trang trại tại Lâm Đồng",
                image: "Vector (5).png",
                quote: "Công nghệ của BeeLife giúp tôi quản lý đàn ong hiệu quả hơn nhiều."
              },
              {
                name: "Anh Phạm Văn C",
                role: "Người nuôi ong tại Bắc Giang",
                image: "Vector (1).png",
                quote: "Thu nhập của tôi đã tăng gấp đôi nhờ áp dụng giải pháp thông minh."
              }
            ].map((story, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="card p-8 text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <Image
                    src={`/images/${story.image}`}
                    alt={story.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="text-gray-600 italic mb-6">"{story.quote}"</p>
                <h4 className="font-semibold text-secondary">{story.name}</h4>
                <p className="text-gray-500">{story.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section bg-white">
        <div className="container text-center">
          <h2 className="heading-2 mb-8">Theo dõi tác động của chúng tôi</h2>
          <p className="paragraph max-w-2xl mx-auto mb-12">
            Đăng ký nhận bản tin để cập nhật những thông tin mới nhất về các dự án và tác động của chúng tôi
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="form-input"
              />
              <button className="btn-primary whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="heading-2 text-center mb-16">Kết nối với chúng tôi</h2>
          <div className="grid-auto-fit">
            {[
              {
                icon: <FacebookIcon />,
                name: "Facebook",
                desc: "Theo dõi tin tức mới nhất",
                url: "https://facebook.com"
              },
              {
                icon: <YouTubeIcon />,
                name: "YouTube",
                desc: "Xem video về hoạt động của chúng tôi",
                url: "https://youtube.com"
              },
              {
                icon: <LinkedInIcon />,
                name: "LinkedIn",
                desc: "Kết nối chuyên nghiệp",
                url: "https://linkedin.com"
              },
              {
                icon: <InstagramIcon />,
                name: "Instagram",
                desc: "Khám phá hình ảnh đẹp",
                url: "https://instagram.com"
              }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-8 text-center hover:border-primary/20 transition-colors duration-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-secondary hover:text-primary transition-colors duration-200">
                  {social.icon}
                </div>
                <h3 className="font-semibold mb-2">{social.name}</h3>
                <p className="text-gray-600">{social.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </main>
  );
} 