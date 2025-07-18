"use client";

import Image from "next/image";
import Link from "next/link";
import { Parallax } from "react-parallax";
import { useCallback, useEffect, useState } from "react";
import { Particles } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Engine, Container } from "@tsparticles/engine";
import { motion } from "framer-motion";
import { useDriveVideo } from "@/hooks/useDriveVideo";
import DriveVideoPlayer from "@/components/DriveVideoPlayer";
import DriveImage from "@/components/DriveImage";
import { DRIVE_CONFIG } from "@/config/drive";
import DriveVideoPlayerWrapper from "@/components/DriveVideoPlayerWrapper";
import DriveImageWrapper from "@/components/DriveImageWrapper";

// Cấu hình particle cho hiệu ứng ong bay
const particlesConfig = {
  fullScreen: {
    enable: false
  },
  particles: {
    number: {
      value: 15,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#FFD700"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.8,
      random: true
    },
    size: {
      value: 6,
      random: true
    },
    links: {
      enable: false
    },
    move: {
      enable: true,
      speed: 3,
      direction: "none" as const,
      random: true,
      straight: false,
      outMode: "out" as const,
      attract: {
        enable: false,
        rotate: {
          x: 600,
          y: 1200
        }
      }
    }
  },
  interactivity: {
    detectsOn: "window" as const,
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      },
      resize: {
        enable: true
      }
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      }
    }
  },
  detectRetina: true
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Xử lý scroll để tạo hiệu ứng parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    setMounted(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Khởi tạo particle.js
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Temporarily disabled due to TypeScript issues
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesConfig}
          className="absolute inset-0 z-20"
        />
        */}
        <div className="absolute inset-0 z-0">
          <DriveVideoPlayerWrapper
            videoName="blur.mp4"
            fallbackSrc="/videos/blur.mp4"
            className="object-cover w-full h-full brightness-50"
            style={{
              transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.5}px)`
            }}
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
          />
        </div>
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Công nghệ nuôi ong thông minh
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Tối ưu hóa quy trình nuôi ong với giải pháp AI và IoT tiên tiến
            </p>
            <div className="flex gap-4">
              <button className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
                Khám phá ngay
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#65BD60] px-8 py-4 rounded-full text-lg font-semibold transition-all">
                Liên hệ tư vấn
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <Parallax
        blur={0}
        bgImage="/images/honey-comb-pattern.jpg"
        bgImageAlt="Honeycomb Pattern"
        strength={200}
        className="py-20"
      >
        <div className="container mx-auto px-4 bg-white/90 py-16 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#4E4540]">
            Tại sao chọn BeeLife?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-6 overflow-hidden rounded-lg">
                <DriveImageWrapper
                  imageName="monitors your colonies 24_7-min.webp"
                  alt="24/7 Monitoring"
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#4E4540] group-hover:text-[#65BD60] transition-colors">Giám sát 24/7</h3>
              <p className="text-gray-600">
                Hệ thống theo dõi thông minh giúp bạn nắm bắt mọi hoạt động của đàn ong
              </p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-6 overflow-hidden rounded-lg">
                <DriveImageWrapper
                  imageName="provides a better bee habitat-min.webp"
                  alt="Better Habitat"
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#4E4540] group-hover:text-[#65BD60] transition-colors">Môi trường tối ưu</h3>
              <p className="text-gray-600">
                Tổ ong được thiết kế khoa học, đảm bảo điều kiện sống tốt nhất cho đàn ong
              </p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-6 overflow-hidden rounded-lg">
                <DriveImageWrapper
                  imageName="honey and hive.webp"
                  alt="Quality Honey"
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#4E4540] group-hover:text-[#65BD60] transition-colors">Mật ong chất lượng</h3>
              <p className="text-gray-600">
                Sản xuất mật ong nguyên chất với công nghệ hiện đại và quy trình kiểm soát chất lượng
              </p>
            </div>
          </div>
        </div>
      </Parallax>

      {/* Stats Section with Counter Animation */}
      <section className="py-20 bg-[#ECF1E5] relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/images/honeycomb-pattern.svg")',
            backgroundSize: '100px',
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <h3 className="text-4xl font-bold text-[#65BD60] mb-2">5000+</h3>
              <p className="text-[#4E4540]">Tổ ong được quản lý</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <h3 className="text-4xl font-bold text-[#65BD60] mb-2">95%</h3>
              <p className="text-[#4E4540]">Tỷ lệ sống của đàn ong</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <h3 className="text-4xl font-bold text-[#65BD60] mb-2">1000+</h3>
              <p className="text-[#4E4540]">Khách hàng tin tưởng</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <h3 className="text-4xl font-bold text-[#65BD60] mb-2">24/7</h3>
              <p className="text-[#4E4540]">Hỗ trợ kỹ thuật</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <Parallax
        blur={0}
        bgImage="/images/bee-on-flower.jpg"
        bgImageAlt="Bee on Flower"
        strength={200}
        className="py-20"
      >
        <div className="container mx-auto px-4 text-center bg-black/50 py-16 rounded-3xl backdrop-blur-sm">
          <h2 className="text-4xl font-bold mb-8 text-white">
            Sẵn sàng bắt đầu hành trình với BeeLife?
          </h2>
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
            Hãy để chúng tôi giúp bạn xây dựng và phát triển trang trại ong của riêng mình
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="bg-[#65BD60] hover:bg-[#4e9749] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-110 hover:shadow-lg"
            >
              Liên hệ ngay
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-[#65BD60] px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-110 hover:shadow-lg"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </Parallax>
    </main>
  );
}
