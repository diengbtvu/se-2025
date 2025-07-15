import { useState, useCallback, useEffect } from 'react';
import { Message, ChatConfig, ChatResponse } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;

const defaultConfig: ChatConfig = {
  nameQuestions: [
    "bạn tên gì", "tên bạn là gì", "mày tên gì", "cậu là ai", "bạn là ai"
  ],
  productQuestions: [
    "mật ong", "loại mật ong", "sản phẩm", "giá mật ong", "mật ong nguyên chất"
  ],
  contactQuestions: [
    "liên hệ", "số điện thoại", "địa chỉ", "email", "kết nối"
  ]
};

export const useChat = (config: ChatConfig = defaultConfig) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Show welcome message when hook is initialized
    appendMessage(
      "Xin chào! Mình là <b>chipi chipi</b> - Nhân viên tư vấn của trang trại mật ong. Mình có thể giúp bạn về sản phẩm, liên hệ, và các câu hỏi liên quan đến mật ong!",
      'bot'
    );
  }, []);

  const appendMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: uuidv4(),
      text,
      sender,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const replaceLastBotMessage = useCallback((newText: string) => {
    setMessages(prev => {
      const messages = [...prev];
      const lastBotIndex = messages.map(m => m.sender).lastIndexOf('bot');
      if (lastBotIndex !== -1) {
        messages[lastBotIndex] = {
          ...messages[lastBotIndex],
          text: newText
        };
      }
      return messages;
    });
  }, []);

  const handleSpecialQuestions = (text: string): boolean => {
    const lowerText = text.toLowerCase();

    if (config.nameQuestions.some(q => lowerText.includes(q))) {
      appendMessage("Mình tên là <b>chipi chipi</b>, nhân viên tư vấn tại trang trại mật ong. Rất vui được hỗ trợ bạn!", 'bot');
      return true;
    }

    if (config.productQuestions.some(q => lowerText.includes(q))) {
      appendMessage("Chúng tôi cung cấp mật ong nguyên chất từ hoa nhãn, hoa cà phê và hoa vải. Bạn muốn biết thêm về loại nào?", 'bot');
      return true;
    }

    if (config.contactQuestions.some(q => lowerText.includes(q))) {
      appendMessage("Bạn có thể liên hệ chúng tôi qua số điện thoại 0123 456 789 hoặc email honeyfarm@example.com.", 'bot');
      return true;
    }

    return false;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    appendMessage(text, 'user');

    if (handleSpecialQuestions(text)) {
      return;
    }

    setIsLoading(true);
    appendMessage("Đang xử lý...", 'bot');

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Bạn là Chipi Chipi, một nhân viên tư vấn của trang trại ong mật. Hãy trả lời câu hỏi: "${text}"` }]
          }]
        })
      });

      const data: ChatResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình chưa hiểu câu hỏi của bạn.";
      replaceLastBotMessage(responseText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý yêu cầu';
      setError(errorMessage);
      replaceLastBotMessage("Lỗi khi gửi yêu cầu: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
}; 