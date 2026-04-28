import { io } from 'socket.io-client';

const getSocketUrl = () => {
  // Production: use environment variable pointing to Railway backend
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  // Development: use localhost
  return 'http://localhost:5000';
};

export const createChatSocket = (token) =>
  io(getSocketUrl(), {
    transports: ['websocket'],
    auth: {
      token
    }
  });
