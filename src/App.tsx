import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { isAxiosError } from "axios";

import Navbar from "./components/Navbar";
import Headers from "./components/Headers";

import Router from "./Router";

import { TUser, TContentProps } from "./types";

import { WHITE_NONTOKEN_PATH_NAMES } from "./consts";

import API from "./api";

function App() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [loadFetchUser, setLoadFetchUser] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<TUser | null>(null);

  const fetchAuthUser = async () => {
    try {
      const response = await API.auth.getUser();
      const userLanguage = response.data.data.language;
      i18n.changeLanguage(userLanguage);
      setUser(response.data.data);
      setLoadFetchUser(true);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    }
  };

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
  }, [location]);

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
