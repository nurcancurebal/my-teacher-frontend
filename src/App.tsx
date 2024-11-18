import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPasword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Headers from './components/Headers';

const App: React.FC = () => {

  const token = localStorage.getItem("token");
  const location = useLocation();
  const navPathName = location.pathname;

  const WHITE_NONTOKEN_PATH_NAMES = ["/", "/register", "/forgot-password", "/reset-password"];

  if (!WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && !token) {
    return <Navigate to="/" />;
  }

  if (WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && token) {
    localStorage.removeItem("token");
  }
  return (
    <div>
      {WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && <Headers />}
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
