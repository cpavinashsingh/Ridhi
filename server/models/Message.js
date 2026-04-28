const mongoose = require('mongoose');

const messageTypes = ['message', 'typing', 'deleted'];

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required']
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required']
    },
    text: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message text cannot exceed 2000 characters'],
      validate: {
        validator: function validateMessageText(value) {
          if (this.type === 'message') {
            return typeof value === 'string' && value.trim().length > 0;
          }

          return value === undefined || value === null || value.trim().length >= 0;
        },
        message: 'Text is required when type is message'
      }
    },
    type: {
      type: String,
      enum: {
        values: messageTypes,
        message: 'Type must be one of: message, typing, deleted'
      },
      default: 'message'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  {
    versionKey: false
  }
);

messageSchema.path('senderId').validate(function validateParticipants(value) {
  return value && this.receiverId && value.toString() !== this.receiverId.toString();
}, 'Sender and receiver must be different users');

module.exports = mongoose.model('Message', messageSchema);
