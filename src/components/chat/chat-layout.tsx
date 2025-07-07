"use client";

import { useState, useEffect } from 'react';
import type { User, Message } from '@/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatLayoutProps {
  currentUser: User;
  recipientUser: User;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How have you been?',
    senderId: 'user2',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    text: "I'm doing great, thanks for asking! Just finished a big project. How about you?",
    senderId: 'user1',
    timestamp: Date.now() - 1000 * 60 * 4,
  },
];

const possibleReplies = [
    "That's awesome to hear! Any plans for the weekend?",
    "Cool! I've been wanting to start a new project myself.",
    "Nice! What kind of project was it?",
    "Sounds productive! Remember to take a break.",
    "Oh really? Tell me more!"
];

export const ChatLayout = ({ currentUser, recipientUser }: ChatLayoutProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [replyDelay, setReplyDelay] = useState<number | null>(null);

  useEffect(() => {
    if (replyDelay !== null) {
      const timer = setTimeout(() => {
        const replyText = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];
        const replyMessage: Message = {
          id: String(Date.now() + 1),
          text: replyText,
          senderId: recipientUser.id,
          timestamp: Date.now() + 1,
        };
        setIsTyping(false);
        setMessages(prev => [...prev, replyMessage]);
        setReplyDelay(null);
      }, replyDelay);

      return () => clearTimeout(timer);
    }
  }, [replyDelay, recipientUser.id]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: String(Date.now()),
      text,
      senderId: currentUser.id,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate a reply from the recipient
    setIsTyping(true);
    setReplyDelay(1500 + Math.random() * 1000);
  };

  return (
    <Card className="w-full max-w-2xl h-full sm:h-[90vh] sm:max-h-[800px] flex flex-col shadow-2xl bg-card/90 backdrop-blur-lg">
      <CardHeader className="p-0">
        <ChatHeader recipientUser={recipientUser} />
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          currentUser={currentUser} 
          recipientUser={recipientUser}
          isTyping={isTyping}
        />
      </CardContent>
      <CardFooter className="p-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          recipientName={recipientUser.name}
        />
      </CardFooter>
    </Card>
  );
};
