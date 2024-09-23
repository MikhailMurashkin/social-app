import React, {useEffect, useContext} from 'react';
import { AuthContext } from './authContext';
import { useNavigate } from 'react-router-dom';

const Blank = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(user) {
      navigate("/rooms")
    } else {
      console.log("NO CONTEXT")
    }
  })

  return (
    <div>
    </div>
  );
};

export default Blank;