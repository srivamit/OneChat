import { Server, type Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User, Message } from '@/types';

// This is a bit of a hack to attach the socket server to the Next.js API response
interface SocketServer extends HTTPServer {
  io?: Server;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// In-memory data stores
let users: User[] = [];
const namePool = ['Alex', 'Ben', 'Chris', 'Dana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Leo', 'Mia', 'Nora', 'Oscar'];
const avatarPool = [
    'https://placehold.co/100x100/98A680/FFFFFF.png',
    'https://placehold.co/100x100/7B8FA1/FFFFFF.png',
    'https://placehold.co/100x100/A8DADC/FFFFFF.png',
    'https://placehold.co/100x100/F1C0B9/FFFFFF.png',
    'https://placehold.co/100x100/E5989B/FFFFFF.png',
    'https://placehold.co/100x100/BDB2FF/FFFFFF.png',
    'https://placehold.co/100x100/FFCDB2/FFFFFF.png',
];

const getAvailableName = () => {
    const usedNames = users.map(u => u.name);
    const availableNames = namePool.filter(n => !usedNames.includes(n));
    if (availableNames.length > 0) {
        return availableNames[Math.floor(Math.random() * availableNames.length)];
    }
    return `User${Math.floor(Math.random() * 1000)}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
        path: '/api/socket_io',
        addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', (socket: Socket) => {
      // Create a new user
      const newUser: User = {
        id: socket.id,
        name: getAvailableName(),
        avatarUrl: avatarPool[Math.floor(Math.random() * avatarPool.length)],
        isOnline: true,
      };
      users.push(newUser);

      // Send the new user their details
      socket.emit('currentUser', newUser);
      
      // Broadcast updated user list to everyone
      io.emit('onlineUsers', users);
      
      console.log(`User connected: ${newUser.name} (${newUser.id})`);
      console.log('Current users:', users.map(u => u.name));


      socket.on('sendMessage', (message: Omit<Message, 'id' | 'timestamp'>) => {
        const fullMessage: Message = {
          ...message,
          id: String(Date.now()),
          timestamp: Date.now(),
        };

        // Send to recipient
        io.to(message.recipientId).emit('receiveMessage', fullMessage);
        // Send back to sender for confirmation
        socket.emit('receiveMessage', fullMessage);
      });

      socket.on('typing', ({ recipientId, isTyping }) => {
        socket.to(recipientId).emit('typing', { senderId: socket.id, isTyping });
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${newUser.name} (${newUser.id})`);
        users = users.filter((user) => user.id !== socket.id);
        io.emit('onlineUsers', users);
        console.log('Current users:', users.map(u => u.name));
      });
    });
  }
  res.end();
}
