const { Server } = require('socket.io');

const authenticateSocket = require('./middleware/authSocket');
const registerChatEvents = require('./handlers/chatEvents');
const { ADMIN_ROOM, getUserRoom } = require('./constants');

const allowedOrigins = (process.env.CLIENT_URL || process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const actor = socket.data.user;

    if (actor.isAdmin) {
      socket.join(ADMIN_ROOM);
    } else {
      socket.join(getUserRoom(actor.chatUserId));
    }

    registerChatEvents(io, socket);
  });

  return io;
};

module.exports = initializeSocket;
