'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems, cart, loading: cartLoading } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Listen for authentication state changes
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      // Force re-render when auth state changes
      // This ensures the header updates immediately after login
      window.location.reload();
    };

    window.addEventListener('authStateChanged', handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange as EventListener);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover-lift" aria-label="BeeLife - Trang chủ">
              <Image
                src="/images/beewise-original-color.png"
                alt="BeeLife Logo"
                width={150}
                height={70}
                className="h-[70px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8" aria-label="Menu chính">
            <Link 
              href="/products"
              className={`nav-link ${pathname === '/products' ? 'active' : ''}`}
            >
              Sản phẩm
            </Link>
            <Link 
              href="/growers"
              className={`nav-link ${pathname === '/growers' ? 'active' : ''}`}
            >
              Nhà nông
            </Link>
            <Link 
              href="/beekeepers"
              className={`nav-link ${pathname === '/beekeepers' ? 'active' : ''}`}
            >
              Nuôi ong
            </Link>
            <Link 
              href="/beesforbuildings"
              className={`nav-link ${pathname === '/beesforbuildings' ? 'active' : ''}`}
            >
              Nuôi ong đô thị
            </Link>
            <Link 
              href="/impact"
              className={`nav-link ${pathname === '/impact' ? 'active' : ''}`}
            >
              Tác động
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Cart Button */}
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-600 hover:text-[#65BD60] transition-colors duration-200"
                  aria-label="Giỏ hàng"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartLoading ? '...' : getTotalItems()}
                    </span>
                  )}
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="w-8 h-8 bg-[#65BD60] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Thong tin ca nhan
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        Don hang cua toi
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                          </svg>
                          Quan ly Admin
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Dang xuat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/get-started"
                  className="btn-primary"
                >
                  Bat dau ngay
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary"
                >
                  Dang nhap
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              <span className="sr-only">{isMenuOpen ? "Đóng menu" : "Mở menu"}</span>
              {!isMenuOpen ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-[32rem] opacity-100 animate-slide-down' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="space-y-2 px-4 pb-6 pt-2">
            <Link
              href="/products"
              className={`block rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 ${
                pathname === '/products'
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-gray-50 hover:text-primary'
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/growers"
              className={`block rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 ${
                pathname === '/growers'
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-gray-50 hover:text-primary'
              }`}
            >
              Nhà nông
            </Link>
            <Link
              href="/beekeepers"
              className={`block rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 ${
                pathname === '/beekeepers'
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-gray-50 hover:text-primary'
              }`}
            >
              Nuôi ong
            </Link>
            <Link
              href="/beesforbuildings"
              className={`block rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 ${
                pathname === '/beesforbuildings'
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-gray-50 hover:text-primary'
              }`}
            >
              Nuôi ong đô thị
            </Link>
            <Link
              href="/impact"
              className={`block rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 ${
                pathname === '/impact'
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-gray-50 hover:text-primary'
              }`}
            >
              Tác động
            </Link>
            <div className="mt-6 space-y-3">
              {isAuthenticated ? (
                <>
                  {/* Cart Link */}
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-3 text-base font-medium text-secondary hover:bg-gray-50 hover:text-primary transition-colors duration-200"
                  >
                    <div className="relative">
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {cartLoading ? '...' : getTotalItems()}
                        </span>
                      )}
                    </div>
                    Gio hang
                  </Link>
                  
                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-base font-medium text-secondary hover:bg-gray-50 hover:text-primary transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Thong tin ca nhan
                  </Link>
                  
                  {/* Orders Link */}
                  <Link
                    href="/orders"
                    className="flex items-center px-4 py-3 text-base font-medium text-secondary hover:bg-gray-50 hover:text-primary transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    Don hang cua toi
                  </Link>
                  
                  {/* Admin Link */}
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-3 text-base font-medium text-secondary hover:bg-gray-50 hover:text-primary transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      Quan ly Admin
                    </Link>
                  )}
                  
                  <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
                    Xin chao, <span className="font-semibold text-[#65BD60]">{user?.name}</span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="btn-secondary w-full justify-center"
                  >
                    Dang xuat
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/get-started"
                    className="btn-primary w-full justify-center"
                  >
                    Bat dau ngay
                  </Link>
                  <Link
                    href="/login"
                    className="btn-secondary w-full justify-center"
                  >
                    Dang nhap
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 