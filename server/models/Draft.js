const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true,
      index: true
    },
    content: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  {
    versionKey: false
  }
);

draftSchema.index({ userId: 1, timestamp: 1 });

module.exports = mongoose.model('Draft', draftSchema);
