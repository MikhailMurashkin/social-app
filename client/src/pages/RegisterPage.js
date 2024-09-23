import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Register Page</h1>
      <RegisterForm />
      <button onClick={()=>navigate('/login')}>Already have an account?</button>
    </div>
  );
};

export default RegisterPage;