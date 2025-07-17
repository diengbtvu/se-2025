import Link from "next/link";

interface AuthRequiredMessageProps {
  message?: string;
}

export default function AuthRequiredMessage({ message = "Bạn cần đăng nhập để xem trang này" }: AuthRequiredMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full block bg-[#65BD60] hover:bg-[#4e9749] text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Đăng nhập ngay
          </Link>
          <Link
            href="/"
            className="w-full block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 