'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { User } from '@/types';

interface SocketContextType {
  socket: Socket | null;
  currentUser: User | null;
  onlineUsers: User[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    // This fetch is to initialize the socket server on the backend.
    fetch('/api/socket');

    const newSocket = io({
        path: '/api/socket_io',
        addTrailingSlash: false,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('currentUser', (user: User) => {
      setCurrentUser(user);
    });

    newSocket.on('onlineUsers', (users: User[]) => {
      setOnlineUsers(users);
    });
    
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, currentUser, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
