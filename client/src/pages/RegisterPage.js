import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="registerPage">
      <RegisterForm />
      <button className="loginButton" onClick={()=>navigate('/login')}>Уже есть аккаунт?</button>
    </div>
  );
};

export default RegisterPage;