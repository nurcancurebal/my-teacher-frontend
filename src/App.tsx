import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPasword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Headers from "./components/Headers";
import TeacherNote from "./pages/TeacherNote";
import GradeCreate from "./pages/GradeCreate";
import ClassCreate from "./pages/ClassCreate";
import StudentCreate from "./pages/StudentCreate";
import Navbar from "./components/Navbar";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/class-create" element={<ClassCreate />} />
          <Route path="/student-create" element={<StudentCreate />} />
          <Route path="/grade-create" element={<GradeCreate />} />
          <Route path="/teacher-note" element={<TeacherNote />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
