import React, { useContext, useState } from 'react';
import { createRoom } from '../api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

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
      <h2>Create a Room</h2>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
        required
      />
      <button type="submit">Create Room</button>
    </form>
  );
};

export default CreateRoom;
