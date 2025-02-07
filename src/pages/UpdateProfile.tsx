import React, { useState, useEffect } from "react";

import API from "../api";

import { TUpdateProfileProps } from "../types";

const UpdateProfile: React.FC<TUpdateProfileProps> = ({
  userData,
  onProfileUpdate,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    setMessage(null);
    setError(null);

    if (userData) {
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setUsername(userData.username);
      setEmail(userData.email);
    }
  }, [userData]);

  const updateUser = async () => {
    setError(null);
    setMessage(null);

    if (!userData) {
      setError("User data is not available.");
      return;
    }

    try {
      await API.user.profileUpdate({
        id: userData.id,
        firstname,
        lastname,
        username,
        email,
      });
      setMessage("Kullanıcı bilgileri başarıyla güncellendi.");
      setTimeout(() => {
        setMessage(null);
        setPassword("");
        onProfileUpdate();
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateUser();
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="my-5 text-center font-semibold text-2xl">
          Profili Güncelle
        </div>
        <div>
          <label
            htmlFor="firstname"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            İsim
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
            Soyisim
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
            Kullanıcı adı
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
            E-posta
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
            htmlFor="password"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            Mevcut Şifre
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

        {error && <p className="mt-3 text-base text-red-600">{error}</p>}
        {message && <p className="mt-3 text-base text-green-600">{message}</p>}
        <div className="sm:flex sm:flex-row-reverse my-8">
          <button
            type="button"
            onClick={updateUser}
            className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
