import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm />
      <button onClick={()=>navigate('/register')}>Don't have an account?</button>
    </div>
  );
};

export default LoginPage;