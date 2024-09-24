import React, { useContext, useState } from 'react';
import { createRoom } from '../api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import '../style/App.css';

const CreateRoom = () => {
  const { user } = useContext(AuthContext);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const newRoom = await createRoom(roomName, localStorage.getItem("token"));
      console.log('Room created:', newRoom);
      navigate(`/room/${newRoom._id}`)
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <form onSubmit={handleCreateRoom}>
      <div className="createRoom">
        <div className='backButton'>
          <ArrowLeftCircleFill width='28' height='28' color='rgb(40,40,40)' 
          onClick={() => navigate('/rooms')} style={{cursor: 'pointer'}} />
        </div>
        <div className="title">Новая комната</div>
        <input
          className="basicInput"
          style={{width: '50%', height: '28px'}}
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Название комнаты"
          required
        />
        <button className="basicButton" type="submit">Создать</button>
      </div>
    </form>
  );
};

export default CreateRoom;
