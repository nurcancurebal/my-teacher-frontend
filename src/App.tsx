import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPasword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {

  const token = localStorage.getItem("token");
  const navPathName = window.location.pathname;

  const WHITE_NONTOKEN_PATH_NAMES = ["/", "/register"];

  if (!WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && !token) {
    return <Navigate to="/" />;
  }

  if (WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && token) {
    localStorage.removeItem("token");
  }
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
