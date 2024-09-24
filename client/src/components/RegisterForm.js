import React, { useState, useContext, useEffect } from 'react';
import {AuthContext} from '../authContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      navigate('/rooms')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(name, email, password);
      navigate('/rooms')
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginForm">
      <div className="title">Регистрация</div>
      <div className="inputs">
        <input className="basicInput" type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="basicInput" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="basicInput" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="basicButton" type="submit">Зарегистрироваться</button>
      </div>
      </div>
    </form>
  );
};

export default RegisterForm;
