import React from "react";
import { Route, Routes } from "react-router-dom";

import Students from "./pages/Students";
import UpdateProfile from "./pages/UpdateProfile";
import Grades from "./pages/Grades";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import UserInformaition from "./pages/UserInformation";
import AddGrade from "./pages/AddGrade";
import UpdateGrade from "./pages/UpdateGrade";
import AddTeacherNote from "./pages/AddTeacherNote";

import { TRouterProps } from "./types";

const Router: React.FC<TRouterProps> = ({ userData, onProfileUpdate }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/parolami-unuttum" element={<ForgotPassword />} />
        <Route path="/sifremi-sifirla" element={<ResetPassword />} />
        <Route path="/kayit-ol" element={<Register />} />
        <Route path="/onizleme" element={<Dashboard />} />
        <Route path="/siniflarim" element={<Classes />} />
        <Route
          path="/kullanici-bilgilerim"
          element={<UserInformaition userData={userData} />}
        />
        <Route path="/not-ekle" element={<AddGrade />} />
        <Route path="/ogretmen-notu-ekle" element={<AddTeacherNote />} />
        <Route path="/not-guncelle" element={<UpdateGrade />} />
        <Route path="/ogrencilerim" element={<Students />} />
        <Route
          path="/profili-guncelle"
          element={
            <UpdateProfile
              userData={userData}
              onProfileUpdate={onProfileUpdate}
            />
          }
        />
        <Route path="/notlar" element={<Grades />} />
      </Routes>
    </>
  );
};

export default Router;
