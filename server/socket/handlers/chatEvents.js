const Message = require('../../models/Message');
const Draft = require('../../models/Draft');
const User = require('../../models/User');
const { ADMIN_CHAT_USER_ID } = require('../../constants/chat');
const {
  ADMIN_ROOM,
  TYPING_DEBOUNCE_HINT_MS,
  getUserRoom,
  isValidObjectId
} = require('../constants');

const isValidMessageType = (type) => ['message', 'typing', 'deleted'].includes(type);

const registerChatEvents = (io, socket) => {
  const actor = socket.data.user;

  socket.emit('typingDebounceConfig', {
    debounceMs: TYPING_DEBOUNCE_HINT_MS
  });

  socket.on('typing', async (payload = {}, ack) => {
    try {
      const content = payload.content === undefined || payload.content === null
        ? ''
        : String(payload.content);

      const draft = await Draft.create({
        userId: actor.chatUserId,
        content,
        timestamp: new Date()
      });

      if (!actor.isAdmin) {
        const drafts = await Draft.find({ userId: actor.chatUserId }).sort({ timestamp: 1 });

        io.to(ADMIN_ROOM).emit('adminTyping', {
          userId: actor.chatUserId,
          content,
          timestamp: draft.timestamp,
          drafts
        });
      }

      if (typeof ack === 'function') {
        ack({ success: true });
      }
    } catch (error) {
      if (typeof ack === 'function') {
        ack({ success: false, message: error.message });
      }
    }
  });

  socket.on('sendMessage', async (payload = {}, ack) => {
    try {
      const { receiverId, type = 'message' } = payload;
      const text = payload.text === undefined || payload.text === null ? '' : String(payload.text);

      if (!isValidMessageType(type)) {
        throw new Error('Invalid message type');
      }

      if (type === 'message' && !text.trim()) {
        throw new Error('Message text is required for type=message');
      }

      let finalReceiverId;

      if (actor.isAdmin) {
        if (!receiverId || !isValidObjectId(receiverId)) {
          throw new Error('Admin must provide a valid receiverId');
        }

        if (receiverId === ADMIN_CHAT_USER_ID) {
          throw new Error('Admin cannot send to admin room id');
        }

        const receiverUser = await User.findById(receiverId);
        if (!receiverUser) {
          throw new Error('Receiver user not found');
        }

        finalReceiverId = receiverId;
      } else {
        if (receiverId && receiverId !== ADMIN_CHAT_USER_ID) {
          throw new Error('Users can only chat with admin');
        }

        finalReceiverId = ADMIN_CHAT_USER_ID;
      }

      const message = await Message.create({
        senderId: actor.chatUserId,
        receiverId: finalReceiverId,
        text,
        type
      });

      const messagePayload = {
        id: message._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        type: message.type,
        createdAt: message.createdAt
      };

      io.to(ADMIN_ROOM).emit('messageReceived', messagePayload);

      if (!actor.isAdmin) {
        io.to(getUserRoom(actor.chatUserId)).emit('messageReceived', messagePayload);
      }

      if (finalReceiverId !== ADMIN_CHAT_USER_ID) {
        io.to(getUserRoom(finalReceiverId)).emit('messageReceived', messagePayload);
      }

      if (typeof ack === 'function') {
        ack({ success: true, data: messagePayload });
      }
    } catch (error) {
      if (typeof ack === 'function') {
        ack({ success: false, message: error.message });
      }
    }
  });
};

module.exports = registerChatEvents;
