import React, { useState, useContext, useEffect } from 'react';
import { loginUser } from '../api';
import {AuthContext} from '../authContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('varya@email.com');
  const [password, setPassword] = useState('password');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      console.log("useEFF")
      // navigate('/')
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
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
