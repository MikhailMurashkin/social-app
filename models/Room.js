const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  inviteCode: {
    type: String,
    unique: true,
  },
  allowNewParticipants: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
