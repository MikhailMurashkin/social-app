import React, { useContext, useState } from 'react';
import { joinRoom } from '../api';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

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
      setWrongCode(true)

      if(error.message == 'Room is closed for new participants') {
        console.log("!!!")
        setWrongCode('closed')
      }
    }
  };

  return (
    <form onSubmit={handleJoinRoom}>
      <h2>Join a Room</h2>
      <input
        type="text"
        value={inviteCode}
        onChange={(e) => {
          setInviteCode(e.target.value)
          setWrongCode('')
        }}
        placeholder="Invite Code"
        required
      />
      {
        wrongCode == '' ? <div>Wrong code</div> : 
        (wrongCode == 'closed' ? <div>Room is closed for new participants</div> : <></>)
      }
      <button type="submit">Join Room</button>
    </form>
  );
};

export default JoinRoom;
