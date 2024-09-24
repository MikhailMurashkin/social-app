import React, { useContext, useState } from 'react';
import { joinRoom } from '../api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import '../style/App.css';

const JoinRoom = () => {
  const { user } = useContext(AuthContext);
  const [inviteCode, setInviteCode] = useState('');
  const navigate = useNavigate();
  const [wrongCode, setWrongCode] = useState('');

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    try {
      const room = await joinRoom(inviteCode, localStorage.getItem("token"));
      console.log('Joined room:', room);
      navigate(`/room/${room._id}`)
    } catch (error) {
      console.error('Error joining room:', error);
      setWrongCode("wrong")

      if(error.message == 'Room is closed for new participants') {
        console.log("!!!")
        setWrongCode('closed')
      }
    }
  };

  return (
    <form onSubmit={handleJoinRoom}>
      <div className="joinRoom">
        <div className='backButton'>
          <ArrowLeftCircleFill width='28' height='28' color='rgb(40,40,40)' 
          onClick={() => navigate('/rooms')} style={{cursor: 'pointer'}} />
        </div>
        <div className="title">Присоединиться к комнате</div>
        <div className='codeInput'>
          <input
          className='basicInput'
          style={{borderColor: wrongCode != '' ? 'red' : 'rgb(40, 40, 40)'}}
            type="text"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value)
              setWrongCode('')
            }}
            placeholder="Пригласительный код"
            required
          />
          {
            wrongCode != '' &&
            <div className='wrongCode'>
              {wrongCode == 'closed' ? "Новые пользователи не могут присоединиться к данной комнате" : "Неверный код"}
            </div> 
          }
      </div>
      <button className="basicButton" type="submit">Присоединиться</button>
      </div>
    </form>
  );
};

export default JoinRoom;
