import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'

import Router from "./Router";

import API from "./api";
import { WHITE_NONTOKEN_PATH_NAMES } from "./consts";
import { TUser, TContentProps } from "./types";

import Navbar from "./components/Navbar";
import Headers from "./components/Headers";

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

      i18n.changeLanguage(userLanguage || "EN");

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

    const authenticateUser = async () => {
      if (WHITE_NONTOKEN_PATH_NAMES.includes(location.pathname)) {
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        i18n.changeLanguage("EN");
        setLoadFetchUser(true);
      } else {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/login");
        }

        await fetchAuthUser();
      }
    };

    authenticateUser();
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
