"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message, User } from '@/types';

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User;
  recipientUser: User;
}

export const ChatMessages = ({ messages, currentUser, recipientUser }: ChatMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
      <div className="p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const user = isCurrentUser ? currentUser : recipientUser;

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2 animate-message-in",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="woman portrait" />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              {isCurrentUser && (
                 <Avatar className="h-8 w-8">
                   <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="abstract geometric" />
                   <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                 </Avatar>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
