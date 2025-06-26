import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-700 text-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg rounded-bl-sm w-fit">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400 flex-shrink-0" />
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
