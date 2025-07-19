'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-primary-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      {/* Main footer content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Logo and description */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="BeeLife - Trang chủ">
              <Image
                src="/images/logo.png"
                alt="BeeLife Logo"
                width={150}
                height={70}
                className="h-[70px] w-auto mb-6"
                priority
              />
            </Link>
            <p className="mt-6 paragraph max-w-md">
              BeeLife giúp các nhà nuôi ong bảo vệ đàn ong khỏi thời tiết khắc nghiệt, dịch bệnh và hóa chất. 
              Từ đó, đàn ong khỏe mạnh sẽ thụ phấn hiệu quả hơn cho cây trồng.
            </p>
            <Link
              href="/get-started"
              className="btn-primary mt-8"
            >
              Bắt đầu ngay
            </Link>
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:px-8">
            {/* Company links */}
            <nav aria-label="Thông tin công ty">
              <h3 className="text-base font-semibold text-secondary">Công ty</h3>
              <ul className="mt-6 space-y-4" role="list">
                <li>
                  <Link href="/about" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="/leadership-team" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Đội ngũ lãnh đạo
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Resources links */}
            <nav aria-label="Tài nguyên">
              <h3 className="text-base font-semibold text-secondary">Tài nguyên</h3>
              <ul className="mt-6 space-y-4" role="list">
                <li>
                  <Link href="/blog" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Sự kiện
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/media" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Media
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Legal links */}
            <nav aria-label="Thông tin pháp lý">
              <h3 className="text-base font-semibold text-secondary">Pháp lý</h3>
              <ul className="mt-6 space-y-4" role="list">
                <li>
                  <Link href="/privacy" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-base text-secondary hover:text-primary transition-colors duration-200">
                    Chính sách cookie
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-100">
        <div className="container py-6">
          <p className="text-base text-secondary">
            © {new Date().getFullYear()} BeeLife. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 