"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  smartReplies: string[];
  isLoadingSmartReplies: boolean;
}

export const ChatInput = ({ onSendMessage, smartReplies, isLoadingSmartReplies }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSmartReplyClick = (reply: string) => {
    setText(reply);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="p-4 border-t bg-card">
      <div className="flex items-center justify-center gap-2 mb-3 h-9">
        {isLoadingSmartReplies ? (
          <>
            <Skeleton className="h-full w-24" />
            <Skeleton className="h-full w-32" />
            <Skeleton className="h-full w-28" />
          </>
        ) : (
          smartReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-full"
              onClick={() => handleSmartReplyClick(reply)}
            >
              {reply}
            </Button>
          ))
        )}
      </div>
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
