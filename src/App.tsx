import React from 'react';
import './App.css';
import './styles.css';
import { useAuth0 } from '@auth0/auth0-react';
import ChatRoom from './views/chatroom';
import Dashboard from './views/dashboard';

function App() {
  const { isAuthenticated } = useAuth0();
  return (
    isAuthenticated ?
      <ChatRoom />
      :
      <Dashboard />
  );
}

export default App;
