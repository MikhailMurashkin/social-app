import React, { useState, useContext, useEffect } from 'react';
import { loginUser } from '../api';
import {AuthContext} from '../authContext';
import { useNavigate } from 'react-router-dom';
import '../style/App.css';

const LoginForm = () => {
  const [email, setEmail] = useState('varya@email.com');
  const [password, setPassword] = useState('password');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      console.log("useEFF")
      navigate('/rooms')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="loginForm">
      <div className="title">Вход в аккаунт</div>
      <div className="inputs">
        <input className="basicInput" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="basicInput" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="basicButton" type="submit">Войти</button>
      </div>
      </div>
  </form>
  );
};

export default LoginForm;
