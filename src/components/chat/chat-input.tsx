"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, SendHorizonal, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  recipientName: string;
}

export const ChatInput = ({ onSendMessage, recipientName }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
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
          onChange={(e) => setText(e.target.value)}
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
