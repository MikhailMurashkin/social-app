// src/components/RoomPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import { getRoomDetails, updateInviteCode, toggleRoomAccess, deleteRoom, leaveRoom, removeParticipant } from '../api';

const RoomPage = () => {
  const { user } = useContext(AuthContext);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')

  useEffect(() => {
    console.log(user)
    const fetchRoomDetails = async () => {
      try {
        const roomData = await getRoomDetails(token, roomId);
        console.log(roomData)
        setRoom(roomData);
        setIsAdmin(roomData.admin._id === user._id);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить данные комнаты');
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [token, roomId, user._id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  const handleUpdateInviteCode = async () => {
    try {
      await updateInviteCode(token, roomId);
      const roomData = await getRoomDetails(token, roomId);
      setRoom(roomData);
    } catch (err) {
      setError('Не удалось обновить код приглашения');
    }
  };

  const handleToggleAccess = async () => {
    try {
      await toggleRoomAccess(token, roomId);
      const roomData = await getRoomDetails(token, roomId);
      setRoom(roomData);
    } catch (err) {
      setError('Не удалось обновить доступ к комнате');
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(token, roomId);
      navigate('/rooms');
    } catch (err) {
      setError('Не удалось удалить комнату');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      await removeParticipant(token, roomId, participantId);
      const roomData = await getRoomDetails(token, roomId);
      setRoom(roomData);
    } catch (err) {
      setError('Не удалось удалить участника');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(token, roomId);
      navigate('/rooms');
    } catch (err) {
      setError('Не удалось покинуть комнату');
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/rooms')}>Back</button>
        
      <h1>{room.name}</h1>
      <p>Админ: {room.admin.name}</p>

      <h3>Участники:</h3>
      <ul>
        {room.participants.map((participant) => (
          <li key={participant._id}>
            {participant.name}
            {isAdmin && participant._id !== user._id && (
              <button onClick={() => handleRemoveParticipant(participant._id)}>Удалить</button>
            )}
          </li>
        ))}
      </ul>

      {isAdmin ? (
        <div>
          <h3>Пригласительный код: {room.inviteCode}</h3>
          <button onClick={handleUpdateInviteCode}>Обновить код приглашения</button>
          {/* <div>{user.name}</div> */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={room.allowNewParticipants}
                onChange={handleToggleAccess}
              />
              Разрешить присоединяться к комнате
            </label>
          </div>
          
          <button onClick={handleDeleteRoom}>Удалить комнату</button>
        </div>
      ) : (
        <button onClick={handleLeaveRoom}>Покинуть комнату</button>
      )}
    </div>
  );
};

export default RoomPage;
