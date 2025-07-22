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

    // Đăng ký
    const registerKeywords = [
      'đăng ký', 'dang ky', 'tạo tài khoản', 'tao tai khoan', 'register', 'sign up', 'mở tài khoản', 'mo tai khoan'
    ];
    if (registerKeywords.some(q => lowerText.includes(q))) {
      appendMessage(
        'Bạn có thể đăng ký tài khoản bằng cách nhấn vào nút Đăng ký ở góc trên cùng bên phải hoặc truy cập đường dẫn /login và chọn Đăng ký. Điền đầy đủ thông tin và xác nhận để hoàn tất đăng ký.',
        'bot'
      );
      return true;
    }

    // Đăng nhập
    const loginKeywords = [
      'đăng nhập', 'dang nhap', 'login', 'sign in', 'vào tài khoản', 'vao tai khoan'
    ];
    if (loginKeywords.some(q => lowerText.includes(q))) {
      appendMessage(
        'Bạn có thể đăng nhập bằng cách nhấn vào nút Đăng nhập ở góc trên cùng bên phải hoặc truy cập đường dẫn /login. Nếu quên mật khẩu, hãy sử dụng chức năng quên mật khẩu trên trang đăng nhập.',
        'bot'
      );
      return true;
    }

    // Đặt hàng/mua hàng
    const orderKeywords = [
      'đặt hàng', 'dat hang', 'mua hàng', 'mua hang', 'thanh toán', 'thanh toan', 'checkout', 'giỏ hàng', 'gio hang', 'order', 'cart'
    ];
    if (orderKeywords.some(q => lowerText.includes(q))) {
      appendMessage(
        'Để đặt hàng, bạn hãy chọn sản phẩm, nhấn "Thêm vào giỏ", sau đó vào giỏ hàng để tiến hành thanh toán. Nếu cần hỗ trợ, hãy liên hệ CSKH.',
        'bot'
      );
      return true;
    }

    // Liên hệ
    const contactKeywords = [
      'liên hệ', 'lien he', 'số điện thoại', 'so dien thoai', 'email', 'kết nối', 'ket noi', 'contact', 'support', 'hỗ trợ', 'ho tro', 'chăm sóc khách hàng', 'cskh'
    ];
    if (contactKeywords.some(q => lowerText.includes(q))) {
      appendMessage(
        'Bạn có thể liên hệ với chúng tôi qua số điện thoại 0123 456 789 hoặc email honeyfarm@example.com.',
        'bot'
      );
      return true;
    }

    // Sản phẩm
    const productKeywords = [
      'mật ong', 'mat ong', 'loại mật ong', 'loai mat ong', 'sản phẩm', 'san pham', 'giá mật ong', 'gia mat ong', 'mật ong nguyên chất', 'mat ong nguyen chat', 'product', 'price', 'loại sản phẩm', 'loai san pham'
    ];
    if (productKeywords.some(q => lowerText.includes(q))) {
      appendMessage(
        'Chúng tôi cung cấp các loại mật ong nguyên chất từ hoa nhãn, hoa cà phê, hoa vải... Bạn muốn biết thêm về loại nào?',
        'bot'
      );
      return true;
    }

    // Kỹ thuật/lỗi
    const techKeywords = [
      'lỗi', 'loi', 'không vào được', 'khong vao duoc', 'không đăng nhập được', 'khong dang nhap duoc', 'không đăng ký được', 'khong dang ky duoc', 'không xem được', 'khong xem duoc', 'bị lỗi', 'bi loi', 'error', 'bug', 'trang web', 'website', 'web', 'không nhận được email', 'khong nhan duoc email'
    ];
    if (techKeywords.some(q => lowerText.includes(q))) {
      appendMessage(
        'Nếu bạn gặp lỗi khi sử dụng website, hãy thử tải lại trang hoặc liên hệ CSKH để được hỗ trợ nhanh nhất.',
        'bot'
      );
      return true;
    }

    // Mặc định: fallback sang các nhóm cũ
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

  const stripMarkdown = (text: string) => {
    // Loại bỏ code block, markdown, ký tự ``` và các ký tự định dạng phổ biến
    return text
      .replace(/```[\s\S]*?```/g, '') // Xóa code block
      .replace(/`([^`]+)`/g, '$1') // Xóa inline code
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Xóa bold
      .replace(/\*([^*]+)\*/g, '$1') // Xóa italic
      .replace(/__([^_]+)__/g, '$1') // Xóa bold
      .replace(/_([^_]+)_/g, '$1') // Xóa italic
      .replace(/~~([^~]+)~~/g, '$1') // Xóa gạch ngang
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Xóa link
      .replace(/\!\[(.*?)\]\((.*?)\)/g, '') // Xóa ảnh
      .replace(/\n{2,}/g, '\n') // Giảm số dòng trống
      .trim();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    appendMessage(text, 'user');

    if (handleSpecialQuestions(text)) {
      return;
    }

    setIsLoading(true);
    appendMessage('Đang soạn tin...', 'bot');

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là Chipi Chipi, một nhân viên tư vấn của trang trại ong mật. Hãy trả lời câu hỏi: "${text}". Lưu ý: KHÔNG sử dụng markdown, KHÔNG dùng code block, KHÔNG dùng ký tự đặc biệt như dấu nháy, dấu backtick, hoặc ba dấu backtick. Chỉ trả lời bằng văn bản thường, không định dạng.`
            }]
          }]
        })
      });

      const data: ChatResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      let responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, mình chưa hiểu câu hỏi của bạn.';
      responseText = stripMarkdown(responseText);
      replaceLastBotMessage(responseText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý yêu cầu';
      setError(errorMessage);
      replaceLastBotMessage('Lỗi khi gửi yêu cầu: ' + errorMessage);
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