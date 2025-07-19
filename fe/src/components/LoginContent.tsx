"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import DriveImageWrapper from "@/components/DriveImageWrapper";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    name: '',
    phoneNumber: '',
    email: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // reCAPTCHA site key (thay thế bằng key thật của bạn)
  const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Test key

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/products';
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateLoginForm = () => {
    if (!formData.userName.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    // Validate họ và tên
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự');
      return false;
    }
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.name.trim())) {
      setError('Họ và tên chỉ được chứa chữ cái và khoảng trắng');
      return false;
    }

    // Validate tên đăng nhập
    if (!formData.userName.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (formData.userName.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return false;
    }
    if (formData.userName.length > 20) {
      setError('Tên đăng nhập không được quá 20 ký tự');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
      setError('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
      return false;
    }

    // Validate email
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Email không hợp lệ. Ví dụ: example@email.com');
      return false;
    }

    // Validate số điện thoại
    if (!formData.phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setError('Số điện thoại không hợp lệ. Ví dụ: 0987654321 hoặc +84987654321');
      return false;
    }

    // Validate mật khẩu
    if (!formData.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password.length > 50) {
      setError('Mật khẩu không được quá 50 ký tự');
      return false;
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      setError('Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số');
      return false;
    }

    // Validate xác nhận mật khẩu
    if (!formData.confirmPassword.trim()) {
      setError('Vui lòng xác nhận mật khẩu');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    // Validate CAPTCHA
    if (!captchaToken) {
      setError('Vui lòng xác nhận bạn không phải robot');
      return false;
    }

    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login form submitted');
    console.log('Form data:', formData);
    
    if (!validateLoginForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Starting login process...');
    setLoading(true);
    setError('');
    setSuccess('');

    login(formData.userName, formData.password)
      .then(result => {
        console.log('Login result:', result);
        if (result.success) {
          console.log('Login successful, redirecting...');
          setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
          setTimeout(() => {
            // Reload trang để cập nhật Header component
            window.location.href = '/products';
          }, 1500);
        } else {
          setError('error' in result ? result.error : 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Login error:', error);
        setError('Lỗi kết nối. Vui lòng thử lại sau.');
        setLoading(false);
      });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    register({
      userName: formData.userName.trim(),
      password: formData.password,
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim()
    })
      .then(result => {
        if (result.success) {
          setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
          setFormData({
            userName: '',
            password: '',
            name: '',
            phoneNumber: '',
            email: '',
            confirmPassword: ''
          });
        } else {
          setError('error' in result ? result.error : 'Đăng ký thất bại. Vui lòng thử lại.');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Register error:', error);
        setError('Lỗi kết nối. Vui lòng thử lại sau.');
        setLoading(false);
      });
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
    setSuccess('');
    setFormData({
      userName: '',
      password: '',
      name: '',
      phoneNumber: '',
      email: '',
      confirmPassword: ''
    });
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError('');
    setSuccess('');
    setCaptchaToken(null);
    recaptchaRef.current?.reset();
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (error && error.includes('robot')) {
      setError('');
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <DriveImageWrapper
                imageName="logo.png"
                alt="BeeLife Logo"
                width={200}
                height={80}
                className="h-[80px] w-auto"
                priority
                fallbackSrc="/images/logo.png"
              />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Toggle Buttons */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                className={`flex-1 py-3 text-center font-semibold rounded-md transition-all duration-200 ${
                  isLogin
                    ? 'bg-white text-[#65BD60] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={switchToLogin}
                disabled={loading}
              >
                Đăng nhập
              </button>
              <button
                className={`flex-1 py-3 text-center font-semibold rounded-md transition-all duration-200 ${
                  !isLogin
                    ? 'bg-white text-[#65BD60] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={switchToRegister}
                disabled={loading}
              >
                Đăng ký
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="userName" className="block text-gray-700 mb-2 font-medium">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập tên đăng nhập"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập mật khẩu"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#65BD60] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#4e9749] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="userName" className="block text-gray-700 mb-2 font-medium">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập tên đăng nhập (ít nhất 3 ký tự)"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập email"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-700 mb-2 font-medium">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BD60] focus:border-transparent transition-all"
                    placeholder="Nhập lại mật khẩu"
                    required
                    disabled={loading}
                  />
                </div>
                
                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                    onExpired={handleCaptchaExpired}
                    theme="light"
                    size="normal"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#65BD60] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#4e9749] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Đăng ký'
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-gray-600">
              <p className="text-sm">
                {isLogin ? (
                  <>
                    Chưa có tài khoản?{' '}
                    <button
                      onClick={switchToRegister}
                      className="text-[#65BD60] hover:underline font-medium"
                      disabled={loading}
                    >
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{' '}
                    <button
                      onClick={switchToLogin}
                      className="text-[#65BD60] hover:underline font-medium"
                      disabled={loading}
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 