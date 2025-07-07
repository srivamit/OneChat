"use client";

import type { User, Message } from '@/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface ChatLayoutProps {
  currentUser: User;
  recipientUser: User;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onTypingChange: (isTyping: boolean) => void;
}

export const ChatLayout = ({
  currentUser,
  recipientUser,
  messages,
  isTyping,
  onSendMessage,
  onTypingChange,
}: ChatLayoutProps) => {

    const router = useRouter();

  return (
    <Card className="w-full max-w-2xl h-full sm:h-[90vh] sm:max-h-[800px] flex flex-col shadow-2xl bg-card/90 backdrop-blur-lg rounded-lg overflow-hidden">
      <CardHeader className="p-0 relative">
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden"
            onClick={() => router.push('/')}
        >
            <ArrowLeft className="h-5 w-5"/>
            <span className="sr-only">Back</span>
        </Button>
        <div className="md:pl-0 pl-12">
            <ChatHeader recipientUser={recipientUser} />
        </div>
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
          onSendMessage={onSendMessage}
          onTypingChange={onTypingChange}
          recipientName={recipientUser.name}
        />
      </CardFooter>
    </Card>
  );
};
