import React from 'react';
import {Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import Blank from './Blank';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './authContext';
import RoomList from './components/RoomList';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import RoomPage from './components/RoomPage';
import ChatPage from './components/ChatPage';
import PrivateRoute from './routes/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';




const App = () => {
  return (
    <AuthProvider>
      <Routes>
          <Route path="/" element={<Blank />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/rooms" element={<PrivateRoute><RoomList /></PrivateRoute>} />
          <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
          <Route path="/join-room" element={<PrivateRoute><JoinRoom /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<PrivateRoute><RoomPage /></PrivateRoute>} />
          <Route path="/room/:roomId/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;