import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Headers from "./components/Headers";

import Router from "./Router";

import { TUser, TContentProps } from "./types";

import { WHITE_NONTOKEN_PATH_NAMES } from "./consts";

import API from "./api";

const App: React.FC = () => {
  const [loadFetchUser, setLoadFetchUser] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<TUser | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (WHITE_NONTOKEN_PATH_NAMES.includes(location.pathname)) {
      setUser(null);
      localStorage.removeItem("token");
      setLoadFetchUser(true);
    } else {
      fetchAuthUser();
    }
  }, [location]);

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

const Content: React.FC<TContentProps> = ({ userData, onProfileUpdate }) => {
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
