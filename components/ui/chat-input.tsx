import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  placeholder: string;
  disabled: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  placeholder, 
  disabled 
}: ChatInputProps) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyPress}
        placeholder={placeholder}
        className="professional-input flex-1 text-sm sm:text-base"
        autoComplete="off"
        disabled={disabled}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className="professional-button-primary w-full sm:w-auto h-9 sm:h-10"
      >
        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sm:hidden ml-2">Send</span>
      </Button>
    </div>
  );
}
