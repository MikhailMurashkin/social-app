const Room = require('../models/Room');
const User = require('../models/User');

exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const room = await Room.create({
      name,
      admin: req.user,
      participants: [req.user],
      inviteCode: generateInviteCode()
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Получение списка комнат
exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { admin: req.user },
        { participants: req.user }
      ]
    }).populate('admin participants', 'name email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Присоединение к комнате
exports.joinRoom = async (req, res) => {
  try {
    const { code } = req.params;
    const room = await Room.findOne({ inviteCode: code });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.allowNewParticipants) {
      return res.status(403).json({ message: 'Room is closed for new participants' });
    }

    if (!room.participants.includes(req.user)) {
      room.participants.push(req.user);
      await room.save();
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Обновление кода приглашения
exports.updateInviteCode = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.admin.equals(req.user)) {
      return res.status(403).json({ message: 'Only the admin can update the invite code' });
    }

    room.inviteCode = generateInviteCode();
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Удаление участника
exports.removeParticipant = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.admin.equals(req.user)) {
      return res.status(403).json({ message: 'Only the admin can remove participants' });
    }

    room.participants = room.participants.filter(
      participantId => !participantId.equals(req.params.participantId)
    );
    console.log(room.participants)
    await room.save();
    res.json(room);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error});
  }
};

exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('admin participants', 'name');

    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }

    const isParticipant = room.participants.some(
      participant => participant._id.toString() === req.user.toString()
    );
    const isAdmin = room.admin._id.toString() === req.user.toString();

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: 'Доступ запрещен. Вы не участник этой комнаты.' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.toggleRoomAccess = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Комната не найдена' });

    if (room.admin.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Только админ может изменять доступ' });
    }

    room.allowNewParticipants = !room.allowNewParticipants;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Комната не найдена' });

    if (room.admin.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Только админ может удалять комнату' });
    }

    await Room.findByIdAndDelete(req.params.roomId);

    res.json({ message: 'Комната успешно удалена' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Комната не найдена' });

    room.participants = room.participants.filter(
      (participant) => participant.toString() !== req.user.toString()
    );
    await room.save();

    res.json({ message: 'Вы покинули комнату' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const generateInviteCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
