import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPasword';

const App: React.FC = () => {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
