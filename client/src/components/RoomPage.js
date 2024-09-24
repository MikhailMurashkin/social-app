// src/components/RoomPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import { getRoomDetails, updateInviteCode, toggleRoomAccess, deleteRoom,
  leaveRoom, removeParticipant, saveRoomDescription,
  startGroupSearch, acceptGroupMatch, declineGroupMatch } from '../api';

const RoomPage = () => {
  const { user } = useContext(AuthContext);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editDescription, setEditDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [searching, setSearching] = useState(false);
  const [match, setMatch] = useState(null);
  const [groupMatch, setGroupMatch] = useState(null);

  const showChatActions = groupMatch && isAdmin && !groupMatch.status.declined;

  const token = localStorage.getItem('token')

  useEffect(() => {
    console.log(user)
    const fetchRoomDetails = async () => {
      try {
        const data = await getRoomDetails(token, roomId);
        const roomData = data.room
        const matchData = data.groupMatch
        
        console.log(data)
        setRoom(roomData);
        console.log(roomData)
        setIsAdmin(roomData.admin._id === user._id);
        setLoading(false);
        setDescription(roomData.description);
        setSearching(roomData.searching);

        if (matchData) {
          setGroupMatch(matchData);
        }

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
      setRoom(roomData.room);
    } catch (err) {
      setError('Не удалось обновить код приглашения');
    }
  };

  const handleToggleAccess = async () => {
    try {
      await toggleRoomAccess(token, roomId);
      const roomData = await getRoomDetails(token, roomId);
      setRoom(roomData.room);
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
      setRoom(roomData.room);
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

  const handleSaveDescription = async () => {
    setLoading(true);
    try {
      await saveRoomDescription(roomId, token, newDescription);
      const roomData = await getRoomDetails(token, roomId);
      setRoom(roomData.room);
      setEditDescription(false);
    } catch (error) {
      console.error('Ошибка при сохранении описания комнаты:', error);
    }
    setLoading(false);
  };


  const handleEditDescription = () => {
    setNewDescription(room.description);
    setEditDescription(true);
  };

  const handleGroupSearch = async () => {
    setLoading(true);
    try {
      const data = await startGroupSearch(roomId, token);
      if (data.match) {
        setMatch(data.match);
        const roomData = await getRoomDetails(token, roomId);
        
        if (roomData.groupMatch) {
          setGroupMatch(roomData.groupMatch);
        }
      } else {
        setSearching(true);
      }
    } catch (error) {
      console.error('Ошибка при поиске группы:', error);
    }
    setLoading(false);
  };


  const handleAcceptChat = async () => {
    setLoading(true);
    try {
      const data = await acceptGroupMatch(groupMatch._id, room._id, token);
      setGroupMatch(prevState => ({
        ...prevState,
        status: { ...prevState.status, acceptedByRoom1: true }
      }));
      console.log(groupMatch)
    } catch (error) {
      console.error('Ошибка при принятии общения:', error);
    }
    setLoading(false);
  };

  const handleDeclineChat = async () => {
    setLoading(true);
    try {
      const data = await declineGroupMatch(groupMatch._id, token);
      setGroupMatch(prevState => ({
        ...prevState,
        status: { ...prevState.status, declined: true }
      }));
      alert(data.message);
    } catch (error) {
      console.error('Ошибка при отклонении общения:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => navigate('/rooms')}>Back</button>

      {isAdmin ? (
        <div>
          <h1>{room.name}</h1>
          <p>Админ: {room.admin.name}</p>

          {(groupMatch && groupMatch.status.acceptedByRoom1 && groupMatch.status.acceptedByRoom2) ? (
            <u onClick={() => navigate(`/room/${room._id}/chat`)} style={{fontStyle: "italic", cursor: "pointer"}}>
              Перейти в чат с группой "{groupMatch.room2.name}"
            </u>
          ) : (groupMatch ? (
            <div style={{backgroundColor: "lightgray"}}>
              <h3>Найдена группа для общения</h3>
              <p>Название: {groupMatch.room2.name}</p>
              <p>Описание: {groupMatch.room2.description}</p>
              <p>Количество участников: {groupMatch.room2.participants.length}</p>
              <b>{groupMatch.status.acceptedByRoom1 ? `Ожидание ответа от группы "${groupMatch.room2.name}"` : ''}</b>

              <div>
                {showChatActions && (
                  <>
                    <button onClick={handleAcceptChat} disabled={loading || groupMatch.status.acceptedByRoom1}>
                      Принять общение
                    </button>
                    <button onClick={handleDeclineChat} disabled={loading}>
                      Отклонить общение
                    </button>
                  </>
                )}
              </div>
              

              {groupMatch.status.declined && <p>Группа отклонила предложение.</p>}
            </div>
          ) : (<></>))}

          {searching ? (
            <p>Подождите - идет поиск подходящей группы для общения...</p>
          ) : !groupMatch ? (
            <button onClick={handleGroupSearch} disabled={loading}>
              Найти группу
            </button>
          ) : <></>}

          <div>
          <h3>Описание комнаты</h3>
            {!editDescription ? (
              <div>
                <p>{room.description || 'Описание не указано'}</p>
                <button onClick={handleEditDescription}>Редактировать описание</button>
              </div>
            ) : (
              <div>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Введите новое описание"
                />
                <button onClick={handleSaveDescription}>Сохранить</button>
                <button onClick={() => setEditDescription(false)}>Отмена</button>
              </div>
            )}
          </div>

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
        <div>
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

          <button onClick={handleLeaveRoom}>Покинуть комнату</button>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
