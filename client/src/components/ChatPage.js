import React, { useState, useContext, useEffect } from 'react';
import { loginUser } from '../api';
import {AuthContext} from '../authContext';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
  })

  return (
    <form>
      <h2>CHAT</h2>
    </form>
  );
};

export default ChatPage;
