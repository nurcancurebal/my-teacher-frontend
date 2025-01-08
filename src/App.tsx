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
import UserInformaition from "./pages/UserInformation";
import AddGrade from "./pages/AddGrade";
import UpdateGrade from "./pages/UpdateGrade";
import AddTeacherNote from "./pages/AddTeacherNote";
import Students from "./pages/Students";

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navPathName = location.pathname;

  const WHITE_NONTOKEN_PATH_NAMES = [
    "/",
    "/kayit-ol",
    "/parolami-unuttum",
    "/sifremi-sifirla",
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
          <Route path="/parolami-unuttum" element={<ForgotPassword />} />
          <Route path="/sifremi-sifirla" element={<ResetPassword />} />
          <Route path="/kayit-ol" element={<Register />} />
          <Route path="/onizleme" element={<Dashboard />} />
          <Route path="/siniflarim" element={<Classes />} />
          <Route path="/kullanici-bilgilerim" element={<UserInformaition />} />
          <Route path="/not-ekle" element={<AddGrade />} />
          <Route path="/ogretmen-notu-ekle" element={<AddTeacherNote />} />
          <Route path="/not-guncelle" element={<UpdateGrade />} />
          <Route path="/ogrencilerim" element={<Students />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
