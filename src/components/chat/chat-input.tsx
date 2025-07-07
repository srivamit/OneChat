"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="p-4 border-t bg-card">
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
          <SendHorizonal className="h-5 w-5 text-accent-foreground" />
          <span className="sr-only">Send Message</span>
        </Button>
      </form>
    </div>
  );
};
