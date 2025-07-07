"use client";

import { useState, useEffect } from 'react';
import { generateSmartReplies } from '@/ai/flows/generate-smart-replies';
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

export const ChatLayout = ({ currentUser, recipientUser }: ChatLayoutProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingSmartReplies, setIsLoadingSmartReplies] = useState(false);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: String(Date.now()),
      text,
      senderId: currentUser.id,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setSmartReplies([]);

    // Simulate a reply from the recipient and generate smart replies
    setTimeout(() => {
      const replyText = "That's awesome to hear! Any plans for the weekend?";
      const replyMessage: Message = {
        id: String(Date.now() + 1),
        text: replyText,
        senderId: recipientUser.id,
        timestamp: Date.now() + 1,
      };
      setMessages(prev => [...prev, replyMessage]);
      fetchSmartReplies(replyText);
    }, 1500);
  };
  
  const fetchSmartReplies = async (message: string) => {
    setIsLoadingSmartReplies(true);
    try {
      const result = await generateSmartReplies({ message });
      if (result.shouldSuggest && result.replies) {
        setSmartReplies(result.replies);
      } else {
        setSmartReplies([]);
      }
    } catch (error) {
      console.error("Error generating smart replies:", error);
      setSmartReplies([]);
    } finally {
      setIsLoadingSmartReplies(false);
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.senderId === recipientUser.id) {
       fetchSmartReplies(lastMessage.text);
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl h-full sm:h-[90vh] sm:max-h-[800px] flex flex-col shadow-2xl">
      <CardHeader className="p-0">
        <ChatHeader recipientUser={recipientUser} />
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ChatMessages messages={messages} currentUser={currentUser} recipientUser={recipientUser} />
      </CardContent>
      <CardFooter className="p-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          smartReplies={smartReplies}
          isLoadingSmartReplies={isLoadingSmartReplies}
        />
      </CardFooter>
    </Card>
  );
};
