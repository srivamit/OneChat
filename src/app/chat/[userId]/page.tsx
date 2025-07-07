'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketProvider';
import type { User, Message } from '@/types';
import { ChatLayout } from '@/components/chat/chat-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage({ params }: { params: { userId: string } }) {
  const { socket, currentUser, onlineUsers } = useSocket();
  const router = useRouter();
  const recipientId = params.userId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const recipientUser = useMemo(() => 
    onlineUsers.find((user) => user.id === recipientId),
    [onlineUsers, recipientId]
  );
  
  useEffect(() => {
    if (currentUser && recipientId === currentUser.id) {
        router.push('/');
    }
  }, [currentUser, recipientId, router]);
  
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (message: Message) => {
      // Only add message if it's part of this conversation
      if (
        (message.senderId === currentUser.id && message.recipientId === recipientId) ||
        (message.senderId === recipientId && message.recipientId === currentUser.id)
      ) {
        setMessages((prev) => [...prev, message]);
        // If the sender was the other person, stop their typing indicator
        if(message.senderId === recipientId) {
            setIsTyping(false);
        }
      }
    };
    
    const handleTyping = ({ senderId, isTyping: typingStatus }: { senderId: string, isTyping: boolean }) => {
        if (senderId === recipientId) {
            setIsTyping(typingStatus);
        }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, currentUser, recipientId, router]);


  const handleSendMessage = (text: string) => {
    if (!socket || !currentUser || !recipientId) return;
    const message: Omit<Message, 'id' | 'timestamp'> = {
      text,
      senderId: currentUser.id,
      recipientId: recipientId,
    };
    socket.emit('sendMessage', message);
  };

  const handleTypingChange = (typing: boolean) => {
    if (!socket || !recipientId) return;
    socket.emit('typing', { recipientId, isTyping: typing });
  }

  if (!currentUser || !recipientUser) {
    return (
        <div className="relative flex h-svh w-full items-center justify-center bg-background p-2 sm:p-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
            <div className="w-full max-w-2xl h-full sm:h-[90vh] sm:max-h-[800px] flex flex-col shadow-2xl bg-card/90 backdrop-blur-lg rounded-lg animate-pulse">
                <div className="p-4 border-b flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
                <div className="flex-1 p-4 space-y-4">
                    <Skeleton className="h-10 w-3/4 rounded-lg" />
                    <Skeleton className="h-10 w-2/3 rounded-lg ml-auto" />
                    <Skeleton className="h-10 w-3/4 rounded-lg" />
                </div>
                <div className="p-4 border-t"><Skeleton className="h-12 w-full rounded-full" /></div>
            </div>
        </div>
    );
  }

  return (
    <div className="relative flex h-svh w-full items-center justify-center bg-background p-2 sm:p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
      <ChatLayout
        currentUser={currentUser}
        recipientUser={recipientUser}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onTypingChange={handleTypingChange}
      />
    </div>
  );
}
