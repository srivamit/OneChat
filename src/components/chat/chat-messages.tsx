"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TypingIndicator } from './typing-indicator';
import type { Message, User } from '@/types';

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User;
  recipientUser: User;
  isTyping: boolean;
}

export const ChatMessages = ({ messages, currentUser, recipientUser, isTyping }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-2">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const user = isCurrentUser ? currentUser : recipientUser;

          const showAvatar = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2 animate-message-in",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              {!isCurrentUser && (
                <div className="w-8 shrink-0">
                  {showAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="woman portrait" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              {isCurrentUser && (
                 <div className="w-8 shrink-0">
                  {showAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="abstract geometric" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {isTyping && <TypingIndicator recipientUser={recipientUser} />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
