import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  return 'http://localhost:5000';
};

export const createChatSocket = (token) =>
  io(getSocketUrl(), {
    transports: ['websocket'],
    auth: {
      token
    }
  });
