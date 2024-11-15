import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPasword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
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
