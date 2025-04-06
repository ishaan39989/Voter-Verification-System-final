import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routes from './routes';
import './assets/styles/main.css';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;