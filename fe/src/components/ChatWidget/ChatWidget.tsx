'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const ChatWidget = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/slide')) {
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage } = useChat();

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      <AnimatePresence>
        {/* Chat Button Container */}
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleToggleChat}
            className={cn(
              "relative w-16 h-16 rounded-full shadow-lg transition-all duration-300",
              "bg-gradient-to-r from-amber-400 to-amber-500",
              "hover:from-amber-500 hover:to-amber-600",
              "flex items-center justify-center",
              "before:content-[''] before:absolute before:inset-0",
              "before:rounded-full before:bg-white before:opacity-20",
              "before:scale-0 hover:before:scale-100",
              "before:transition-transform before:duration-300",
              isOpen ? "rotate-180" : "rotate-0"
            )}
            title="Chat với Chipi"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              {/* Hiệu ứng sóng */}
              <div className="absolute -inset-2 rounded-full animate-ping bg-amber-400 opacity-20"></div>
              {/* Icon */}
              <div className="relative z-10 text-white">
                {isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                )}
              </div>
            </div>
          </motion.button>

          {/* Label */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn(
              "bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg",
              "font-semibold cursor-pointer",
              "hover:bg-amber-50 transition-all duration-300",
              "border border-amber-100",
              "flex items-center gap-2"
            )}
            onClick={handleToggleChat}
          >
            <span>{isOpen ? 'Thu gọn' : 'Chat với Chipi'}</span>
            {!isOpen && (
              <div className="flex -space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce delay-200"></div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-28 right-5 w-[420px] h-[640px] bg-white rounded-2xl",
              "shadow-2xl flex flex-col overflow-hidden",
              "border border-amber-100"
            )}
          >
            {/* Header */}
            <div className={cn(
              "bg-gradient-to-r from-amber-400 to-amber-500",
              "text-white p-4 text-center font-bold",
              "flex items-center justify-center gap-2"
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 animate-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Chipi Chipi - Tư vấn mật ong</span>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[70%] p-3 rounded-xl shadow-sm",
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-gray-800' 
                        : 'bg-white border border-gray-100 text-gray-800'
                    )}
                  >
                    <p 
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  className={cn(
                    "flex-1 p-3 rounded-xl border border-gray-200",
                    "resize-none h-[50px] focus:outline-none",
                    "focus:ring-2 focus:ring-amber-400 focus:border-transparent",
                    "placeholder-gray-400 text-gray-600"
                  )}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium",
                    "bg-gradient-to-r from-amber-400 to-amber-500",
                    "text-white shadow-lg",
                    "hover:from-amber-500 hover:to-amber-600",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center gap-2"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <span>Gửi</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 