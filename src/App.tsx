import React, { useCallback, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
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

import instance from "./services/axiosInstance";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: Date;
  last_updated: Date;
}

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navPathName = location.pathname;
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate();

  const WHITE_NONTOKEN_PATH_NAMES = [
    "/",
    "/kayit-ol",
    "/parolami-unuttum",
    "/sifremi-sifirla",
  ];

  const isTokenValid = token && token !== "undefined" && token !== "";

  const fetchUser = useCallback(async () => {
    console.log("app.tsx fetchUser");
    try {
      const user = await instance.get<{ data: User }>("user");
      setUser(user.data.data);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("app.tsx useEffect");
    if (isTokenValid) {
      fetchUser();
    }
  }, [isTokenValid, fetchUser]);

  const handleProfileUpdate = useCallback(() => {
    console.log("app.tsx handleProfileUpdate");
    fetchUser();
  }, [fetchUser]);

  if (!WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && !isTokenValid) {
    return <Navigate to="/" />;
  }

  if (WHITE_NONTOKEN_PATH_NAMES.includes(navPathName) && isTokenValid) {
    localStorage.removeItem("token");
  }
  return (
    <div>
      {isTokenValid ? (
        <Navbar userData={user} onProfileUpdate={handleProfileUpdate} />
      ) : (
        <Headers />
      )}
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/parolami-unuttum" element={<ForgotPassword />} />
          <Route path="/sifremi-sifirla" element={<ResetPassword />} />
          <Route path="/kayit-ol" element={<Register />} />
          <Route path="/onizleme" element={<Dashboard />} />
          <Route path="/siniflarim" element={<Classes />} />
          <Route
            path="/kullanici-bilgilerim"
            element={
              <UserInformaition
                userData={user}
                onProfileUpdate={handleProfileUpdate}
              />
            }
          />
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
