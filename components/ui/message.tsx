import React from 'react';
import { Bot, User } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageComponentProps {
  message: Message;
}

export function MessageComponent({ message }: MessageComponentProps) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[95%] sm:max-w-[85%] lg:max-w-[75%] px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
          message.isUser
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm"
            : "bg-gray-700 text-gray-200 rounded-bl-sm"
        }`}
      >
        <div className="flex items-start space-x-1 sm:space-x-2">
          {!message.isUser && (
            <Bot className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-indigo-400 flex-shrink-0" />
          )}
          {message.isUser && (
            <User className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-white flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {message.isUser ? (
              <p className="text-xs sm:text-sm break-words hyphens-auto leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
            ) : (
              <div className="text-xs sm:text-sm break-words hyphens-auto leading-relaxed">
                <MarkdownRenderer content={message.text} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
