const mongoose = require('mongoose');

const ADMIN_ROOM = 'admins';
const TYPING_DEBOUNCE_HINT_MS = 250;

const getUserRoom = (userId) => `user:${userId}`;
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = {
  ADMIN_ROOM,
  TYPING_DEBOUNCE_HINT_MS,
  getUserRoom,
  isValidObjectId
};
