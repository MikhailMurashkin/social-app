import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../style/App.css';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="loginPage">
      <LoginForm />
      <button className="loginButton" onClick={()=>navigate('/register')}>Нет аккаунта?</button>
    </div>
  );
};

export default LoginPage;