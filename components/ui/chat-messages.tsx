import React, { forwardRef } from 'react';
import { MessageComponent } from '@/components/ui/message';
import { TypingIndicator } from '@/components/ui/typing-indicator';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, isTyping }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-64 sm:h-72 lg:h-80 overflow-y-auto p-3 sm:p-4 bg-gray-900/50 rounded-lg border border-indigo-500/20 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-800"
      >
        <div className="space-y-3 sm:space-y-4 min-h-full flex flex-col">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Scroll anchor */}
          <div />
        </div>
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';
