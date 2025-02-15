import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Classes from "./pages/class/Classes";
import ClassIdStudents from "./pages/class/ClassIdStudents";

import Students from "./pages/student/Students";
import StudenIdGrades from "./pages/student/StudenIdGrades";

import UpdateProfile from "./pages/profile/UpdateProfile";
import MyProfile from "./pages/profile/MyProfile";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AddGrade from "./pages/grade/AddGrade";
import ClassNotes from "./pages/grade/ClassNotes";
import Grades from "./pages/grade//Grades";

import { TContentProps } from "./types";

function Router({ userData, onProfileUpdate }: TContentProps) {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route
          path="/add-grade"
          element={<AddGrade />}
        />
        <Route
          path="/class-notes"
          element={<ClassNotes />} />
        <Route
          path="/student-grades"
          element={<StudenIdGrades />} />
        <Route
          path="/class-students/:classId/:className"
          element={<ClassIdStudents
          />}
        />
      </Routes>
    </>
  );
};

export default Router;
