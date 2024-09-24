const Room = require('../models/Room');
const User = require('../models/User');
const GroupMatch = require('../models/GroupMatch');


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
    const { roomId } = req.params;
    const room = await Room.findById(roomId)
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

    const groupMatch = await GroupMatch.findOne({
      $or: [{ room1: roomId }, { room2: roomId }],
      'status.declined': false,
    }).populate('room1 room2');

    if (groupMatch && groupMatch.room2._id.equals(roomId)) {
      [groupMatch.room1, groupMatch.room2] = [groupMatch.room2, groupMatch.room1];
      [groupMatch.status.acceptedByRoom1, groupMatch.status.acceptedByRoom2] = [groupMatch.status.acceptedByRoom2, groupMatch.status.acceptedByRoom1];
    }

    res.status(200).json({
      room,
      groupMatch,
    })
  } catch (error) {
    console.log(error)
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

exports.updateRoomDescription = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }

    if (room.admin.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Только админ может редактировать описание комнаты' });
    }

    room.description = req.body.description;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления описания' });
  }
};




exports.startSearch = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const currentRoom = await Room.findById(roomId);


    if (!currentRoom) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }

    if (currentRoom.searching) {
      return res.status(400).json({ message: 'Группа уже в поиске' });
    }

    const otherRoom = await Room.findOne({ searching: true, _id: { $ne: roomId } });

    if (otherRoom) {
      const match = new GroupMatch({
        room1: currentRoom._id,
        room2: otherRoom._id,
      });
      await match.save();

      currentRoom.searching = false;
      otherRoom.searching = false;
      await currentRoom.save();
      await otherRoom.save();

      return res.json({ message: 'Группа найдена', match });
    } else {
      currentRoom.searching = true;
      await currentRoom.save();

      return res.json({ message: 'Поиск начат, ожидайте группу' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getSearchStatus = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }

    return res.json({ searching: room.searching });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.createGroupMatch = async (req, res) => {
  const { room1Id, room2Id } = req.body;
  try {
    const groupMatch = new GroupMatch({ room1: room1Id, room2: room2Id });
    await groupMatch.save();
    res.status(201).json(groupMatch);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания матча', error });
  }
};

exports.acceptGroupMatch = async (req, res) => {
  const { matchId, roomId } = req.params;

  try {
    const match = await GroupMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Пара групп не найдена' });
    }

    if (match.room1.equals(roomId)) {
      match.status.acceptedByRoom1 = true;
    } else if (match.room2.equals(roomId)) {
      match.status.acceptedByRoom2 = true;
    } else {
      return res.status(403).json({ message: 'Вы не являетесь админом данной комнаты' });
    }

    await match.save();
    
    if (match.status.acceptedByRoom1 && match.status.acceptedByRoom2) {
      return res.status(200).json({ message: 'Обе группы приняли общение!', match });
    }

    res.status(200).json({ message: 'Ожидаем ответа другой группы', match });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка принятия матча', error });
  }
};

exports.declineGroupMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const match = await GroupMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Матч не найден' });
    }

    match.status.declined = true;
    await match.save();

    res.status(200).json({ message: 'Группа отклонила предложение общения' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка отклонения матча', error });
  }
};
