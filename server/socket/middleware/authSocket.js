const jwt = require('jsonwebtoken');

const { ADMIN_CHAT_USER_ID } = require('../../constants/chat');
const { isValidObjectId } = require('../constants');

const extractToken = (socket) => {
  const authToken = socket.handshake.auth && socket.handshake.auth.token;
  if (authToken) {
    return String(authToken).replace(/^Bearer\s+/i, '').trim();
  }

  const headerValue = socket.handshake.headers && socket.handshake.headers.authorization;
  if (!headerValue) {
    return '';
  }

  return String(headerValue).replace(/^Bearer\s+/i, '').trim();
};

const authenticateSocket = (socket, next) => {
  const token = extractToken(socket);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new Error('Socket authentication failed: JWT_SECRET missing'));
  }

  if (!token) {
    return next(new Error('Socket authentication failed: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded.isAdmin && !isValidObjectId(decoded.userId)) {
      return next(new Error('Socket authentication failed: Invalid user id'));
    }

    socket.data.user = {
      userId: String(decoded.userId),
      username: decoded.username,
      isAdmin: Boolean(decoded.isAdmin),
      chatUserId: decoded.isAdmin ? ADMIN_CHAT_USER_ID : String(decoded.userId)
    };

    return next();
  } catch (_error) {
    return next(new Error('Socket authentication failed: Invalid token'));
  }
};

module.exports = authenticateSocket;
