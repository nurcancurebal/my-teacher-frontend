import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import UpdateProfile from "./pages/UpdateProfile";
import Grades from "./pages/Grades";
import MyProfile from "./pages/MyProfile";

import { TContentProps } from "./types";

function Router({ userData, onProfileUpdate }: TContentProps) {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/students" element={<Students />} />
        <Route path="/grades" element={<Grades />} />
        <Route
          path="/update-profile"
          element={<UpdateProfile userData={userData} onProfileUpdate={onProfileUpdate} />}
        />
        <Route
          path="/my-profile"
          element={<MyProfile userData={userData} />}
        />
      </Routes>
    </>
  );
};

export default Router;
