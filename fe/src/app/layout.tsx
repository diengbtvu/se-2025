import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layouts/MainLayout";
import { ChatWidget } from '@/components/ChatWidget/ChatWidget';
import { AuthProvider } from "@/contexts/AuthContext";

const fontSans = FontSans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Trang trại mật ong",
  description: "Mật ong nguyên chất từ trang trại",
  keywords: ["nuôi ong", "công nghệ", "nông nghiệp thông minh", "bảo vệ môi trường", "BeeLife"],
  authors: [{ name: "BeeLife Team" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`min-h-screen bg-white font-sans antialiased ${fontSans.variable}`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
