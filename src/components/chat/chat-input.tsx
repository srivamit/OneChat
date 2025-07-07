"use client";

import { useState, type FormEvent, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, SendHorizonal, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  recipientName: string;
}

export const ChatInput = ({ onSendMessage, onTypingChange, recipientName }: ChatInputProps) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        onTypingChange(false);
      }
    };
  }, [onTypingChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
    // Signal typing has started
    if (!typingTimeoutRef.current) {
      onTypingChange(true);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to signal typing has stopped
    typingTimeoutRef.current = setTimeout(() => {
        onTypingChange(false);
        typingTimeoutRef.current = null;
    }, 2000); // User is considered "not typing" after 2 seconds of inactivity
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
    
    // Clear typing state immediately on send
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
    }
    onTypingChange(false);
  };

  return (
    <div className="p-4 border-t bg-card">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          <Button type="button" variant="ghost" size="icon" className="shrink-0">
              <Smile className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Emoji</span>
          </Button>
        </div>
        <Input
          type="text"
          placeholder={`Message ${recipientName}...`}
          value={text}
          onChange={handleInputChange}
          className="w-full h-12 rounded-full bg-secondary px-12 pr-20"
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <Button type="button" variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Attach file</span>
            </Button>
            <Button type="submit" size="icon" className="rounded-full bg-primary text-primary-foreground w-9 h-9 shrink-0">
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send Message</span>
            </Button>
        </div>
      </form>
    </div>
  );
};
