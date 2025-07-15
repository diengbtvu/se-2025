export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface ChatConfig {
  nameQuestions: string[];
  productQuestions: string[];
  contactQuestions: string[];
}

export interface ChatResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
} 