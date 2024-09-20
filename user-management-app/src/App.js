import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(logout, 10 * 60 * 1000); // 15 minutes
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    resetTimeout(); // Initialize the timeout

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [logout]);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;