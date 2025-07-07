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

const aliceConversationalSnippets = [
    "Just saw the funniest video, I'll send it to you later!",
    "Ugh, this coffee is not kicking in today.",
    "What are you up to this weekend?",
    "I'm thinking of re-watching that series we talked about.",
    "Did you see the news about that new tech gadget?",
    "Random thought: are hotdogs sandwiches?",
    "My cat is doing the funniest thing right now.",
    "I need to remember to water my plants...",
    "Feeling a bit hungry, what's for lunch?",
    "This music is really helping me focus."
];

export const ChatLayout = ({ currentUser, recipientUser }: ChatLayoutProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Simulate live messages from the recipient
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const simulateReceivingMessage = () => {
      // Schedule the next message reception
      const nextMessageDelay = 8000 + Math.random() * 7000; // 8-15 seconds

      timeoutId = setTimeout(() => {
        setIsTyping(true);
        const typingDuration = 1000 + Math.random() * 1500; // Recipient "types" for 1-2.5 seconds

        // After "typing", send the message
        setTimeout(() => {
          const replyText = aliceConversationalSnippets[Math.floor(Math.random() * aliceConversationalSnippets.length)];
          const newMessage: Message = {
            id: String(Date.now()),
            text: replyText,
            senderId: recipientUser.id,
            timestamp: Date.now(),
          };

          setIsTyping(false);
          setMessages(prev => [...prev, newMessage]);
          
          // Trigger the next cycle
          simulateReceivingMessage();
        }, typingDuration);

      }, nextMessageDelay);
    };
    
    simulateReceivingMessage();

    // Clean up the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [recipientUser.id]);


  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: String(Date.now()),
      text,
      senderId: currentUser.id,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
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
