import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Headers from "./components/Headers";

import Router from "./Router";

import { TUser, TContentProps } from "./types";

import { WHITE_NONTOKEN_PATH_NAMES } from "./consts";

import API from "./api";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loadFetchUser, setLoadFetchUser] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<TUser | null>(null);


  useEffect(() => {
    if (WHITE_NONTOKEN_PATH_NAMES.includes(location.pathname)) {
      setUser(null);
      localStorage.removeItem("access_token");
      setLoadFetchUser(true);
    } else {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
      }

      fetchAuthUser();
    }
  }, [location, navigate]);

  async function fetchAuthUser() {
    try {
      const response = await API.auth.getUser();
      setUser(response.data.data);
      setLoadFetchUser(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {loadFetchUser && (
        <Content userData={user} onProfileUpdate={fetchAuthUser} />
      )}
    </div>
  );
};

function Content({ userData, onProfileUpdate }: TContentProps) {
  return (
    <>
      {userData ? <Navbar userData={userData} /> : <Headers />}
      <main>
        <Router userData={userData} onProfileUpdate={onProfileUpdate} />
      </main>
    </>
  );
};

export default App;
