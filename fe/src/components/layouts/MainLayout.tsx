'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const isSlidePage = pathname?.startsWith('/slide');

  if (isSlidePage) {
    // Render content only, without header/footer
    return (
      <main id="main-content" className="flex min-h-screen flex-col bg-white" role="main">
        {children}
      </main>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-primary">
        Chuyển đến nội dung chính
      </a>
      <Header />
      <main id="main-content" className="flex-grow" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 