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
      window.location = '/rooms'
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
