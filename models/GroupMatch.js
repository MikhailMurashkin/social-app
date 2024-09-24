const mongoose = require('mongoose');

const groupMatchSchema = new mongoose.Schema({
  room1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  room2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    acceptedByRoom1: { type: Boolean, default: false },
    acceptedByRoom2: { type: Boolean, default: false },
    declined: { type: Boolean, default: false },
  }
});

module.exports = mongoose.model('GroupMatch', groupMatchSchema);