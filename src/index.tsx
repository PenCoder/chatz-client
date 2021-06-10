import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MainAuthProvider from './auth/MainAuthProvider';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <MainAuthProvider>
      <App />
    </MainAuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
