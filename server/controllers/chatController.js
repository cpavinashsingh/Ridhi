const mongoose = require('mongoose');

const Message = require('../models/Message');
const User = require('../models/User');
const { ADMIN_CHAT_USER_ID } = require('../constants/chat');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getRequestUserId = (req) => {
  if (req.user && req.user.isAdmin) {
    return ADMIN_CHAT_USER_ID;
  }

  return req.user.userId;
};

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text, type = 'message' } = req.body;
    const senderId = getRequestUserId(req);

    if (!['message', 'typing', 'deleted'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message type'
      });
    }

    if (type === 'message' && (!text || !String(text).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required for type=message'
      });
    }

    let finalReceiverId;

    if (req.user.isAdmin) {
      if (!receiverId) {
        return res.status(400).json({
          success: false,
          message: 'receiverId is required for admin messages'
        });
      }

      if (!isValidObjectId(receiverId)) {
        return res.status(400).json({
          success: false,
          message: 'receiverId must be a valid user id'
        });
      }

      if (receiverId === ADMIN_CHAT_USER_ID) {
        return res.status(400).json({
          success: false,
          message: 'Admin cannot send message to admin chat id'
        });
      }

      const receiverUser = await User.findById(receiverId);
      if (!receiverUser) {
        return res.status(404).json({
          success: false,
          message: 'Receiver user not found'
        });
      }

      finalReceiverId = receiverId;
    } else {
      if (!isValidObjectId(req.user.userId)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid authenticated user id'
        });
      }

      if (receiverId && receiverId !== ADMIN_CHAT_USER_ID) {
        return res.status(403).json({
          success: false,
          message: 'Users can only send messages to admin'
        });
      }

      finalReceiverId = ADMIN_CHAT_USER_ID;
    }

    const message = await Message.create({
      senderId,
      receiverId: finalReceiverId,
      text,
      type
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    return next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const { userId } = req.query;

      if (userId) {
        if (!isValidObjectId(userId)) {
          return res.status(400).json({
            success: false,
            message: 'userId must be a valid user id'
          });
        }

        const conversation = await Message.find({
          $or: [
            { senderId: userId, receiverId: ADMIN_CHAT_USER_ID },
            { senderId: ADMIN_CHAT_USER_ID, receiverId: userId }
          ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({
          success: true,
          data: conversation
        });
      }

      const allAdminChats = await Message.find({
        $or: [{ senderId: ADMIN_CHAT_USER_ID }, { receiverId: ADMIN_CHAT_USER_ID }]
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: allAdminChats
      });
    }

    if (!isValidObjectId(req.user.userId)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authenticated user id'
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.user.userId, receiverId: ADMIN_CHAT_USER_ID },
        { senderId: ADMIN_CHAT_USER_ID, receiverId: req.user.userId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages
};
