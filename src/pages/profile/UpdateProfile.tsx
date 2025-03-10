import React, { useState, useEffect } from "react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../api";
import { TContentProps } from "../../types";

function UpdateProfile({
  userData,
  onProfileUpdate,
}: TContentProps) {
  const { t } = useTranslation();

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {

    if (userData) {
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setUsername(userData.username);
      setEmail(userData.email);
      setLanguage(userData.language || "");
    }
  }, [userData]);

  const updateUser = async () => {

    if (!userData) {
      toast.error(t('USER_DATA_NOT_AVAILABLE'));
      return;
    }

    try {
      const response = await API.profile.update({
        id: userData.id,
        firstname,
        lastname,
        username,
        email,
        password,
        language,
      });
      toast.success(response.data.message);
      setPassword("");
      onProfileUpdate();
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateUser();
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="my-7 text-center font-semibold text-2xl mt-20">
        {t("UPDATE_PROFILE")}
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <label
            htmlFor="firstname"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            {t("FIRSTNAME")}:
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
          />
        </div>

        <div>
          <label
            htmlFor="lastname"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            {t("LASTNAME")}:
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            {t("USERNAME")}:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            {t("EMAIL")}:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            {t("LANGUAGE")}:
          </label>
          <div className="grid grid-cols-2">
            <button
              type="button"
              className={`my-5 mx-auto inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 disabled:opacity-75 disabled:hover:bg-white ${language === "EN" ? "bg-slate-200" : "bg-white"
                }`}
              onClick={() => setLanguage("EN")}
            >
              English
            </button>
            <button
              type="button"
              className={`my-5 mx-auto inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 disabled:opacity-75 disabled:hover:bg-white ${language === "TR" ? "bg-slate-200" : "bg-white"
                }`}
              onClick={() => setLanguage(t("TR"))}
            >
              Türkçe
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            {t("PASSWORD")}:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
          />
        </div>

        <div className="sm:flex sm:flex-row-reverse my-8">
          <button
            type="button"
            onClick={updateUser}
            className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
          >
            {t("UPDATE")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
