import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPasword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Headers from "./components/Headers";
import Classes from "./pages/Classes";
import Navbar from "./components/Navbar";
import UpdateProfile from "./pages/UpdateProfile";
import AddGrade from "./pages/AddGrade";
import UpdateGrade from "./pages/UpdateGrade";

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navPathName = location.pathname;

  const WHITE_NONTOKEN_PATH_NAMES = [
    "/",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const isTokenValid = token && token !== "undefined" && token !== "";

  if (!WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && !isTokenValid) {
    return <Navigate to="/" />;
  }

  if (WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && isTokenValid) {
    localStorage.removeItem("token");
  }
  return (
    <div>
      {isTokenValid ? <Navbar /> : <Headers />}
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/add-grade" element={<AddGrade />} />
          <Route path="/update-grade" element={<UpdateGrade />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
