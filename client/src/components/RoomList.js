import React, { useContext, useEffect, useState } from 'react';
import { getUserRooms } from '../api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { PeopleFill, PlusCircleFill } from 'react-bootstrap-icons';
import '../style/App.css';

const RoomList = () => {
  const { user, logout } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      if (user) {
        try {
          const roomsData = await getUserRooms(localStorage.getItem("token"));
          console.log(roomsData)
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
    <div className="roomList">
      <div className="title">Мои комнаты</div>
      <div className="roomCards">
        <Card bg="primary" border="primary" style={{ width: '16rem', height: '10rem' }} className='roomButton' onClick={() => navigate('/create-room')}>
          <PlusCircleFill width='80' height='80' color='rgba(255,255,255,0.65)'/>
          <Card.Text style={{color: 'white'}}>
          Создать новую комнату
          </Card.Text>
        </Card>
        <Card bg="primary" border="primary" style={{ width: '16rem', height: '10rem' }} className='roomButton' onClick={() => navigate('/join-room')}>
          <PeopleFill width='80' height='80' color='rgba(255,255,255,0.65)' />
          <Card.Text style={{color: 'white'}}>
          Присоединиться к комнате
          </Card.Text>
        </Card>
          {rooms.map(room => {
            let admin = room.admin._id == user._id ? "Вы" : room.admin.name
            return(
            <Card style={{ width: '16rem', height: '10rem' }} key={room.toString()} onClick={() => navigate(`/room/${room._id}`)}
            className='roomCard'>
                <Card.Body>
                    <Card.Title as="h3">{room.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Администратор: {admin}</Card.Subtitle>
                    <Card.Footer className="text-muted">{room.description}</Card.Footer>
                </Card.Body>
            </Card>
          )})}
      </div>
    </div>
  );
};

export default RoomList;
