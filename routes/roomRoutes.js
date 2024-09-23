const express = require('express');
const {
  createRoom,
  getMyRooms,
  joinRoom,
  updateInviteCode,
  removeParticipant,
  getRoomDetails,
  toggleRoomAccess,
  deleteRoom,
  leaveRoom
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getMyRooms);
router.post('/create-room', protect, createRoom);
router.post('/join/:code', protect, joinRoom);
router.put('/:roomId/invite-code', protect, updateInviteCode);
router.get('/:roomId', protect, getRoomDetails);
router.delete('/:roomId', protect, deleteRoom);
router.delete('/:roomId/participants/:participantId', protect, removeParticipant);
router.put('/:roomId/toggle-access', protect, toggleRoomAccess);
router.post('/:roomId/leave', protect, leaveRoom);

module.exports = router;