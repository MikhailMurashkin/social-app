import React, { useContext, useEffect, useState } from 'react';
import { getUserRooms } from '../api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

const RoomList = () => {
  const { user, logout } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      if (user) {
        try {
          const roomsData = await getUserRooms(localStorage.getItem("token"));
          setRooms(roomsData);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      } else {
        console.log("LOGOUT")
        logout()
      }
    };
    fetchRooms();
  }, [user]);

  return (
    <div>
      <h2>My Rooms</h2>
      <button onClick={() => navigate('/create-room')}>Create new room</button>
      <button onClick={() => navigate('/join-room')}>Join room</button>
      <ul>
        {rooms.map(room => (
          <li key={room._id}  >
            <b onClick={() => navigate(`/room/${room._id}`)} style={{cursor: 'pointer'}}>
              {room.name} (Admin: {room.admin.name})
            </b>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
