"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import for client-only component
const LoginContent = dynamic(() => import("@/components/LoginContent"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
});

export default function Login() {
  return <LoginContent />;
} 