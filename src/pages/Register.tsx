import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { isAxiosError } from "axios";

import API from "../api";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await API.auth.register({
        firstname,
        lastname,
        username,
        email,
        password,
      });
      setMessage("Kayıt başarılı. Yönlendiriliyorsunuz...");
      localStorage.setItem("token", response.data.data.accessToken);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Kayıt olun
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="firstname"
                className="block text-lg font-medium text-gray-900"
              >
                İsim
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                required
                autoComplete="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-lg font-medium text-gray-900"
              >
                Soyisim
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                required
                autoComplete="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-900"
              >
                Kullanıcı adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-900"
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
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-gray-900"
                >
                  Şifre
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? "Kayıt işlemi gerçekleştiriliyor..." : "Kayıt ol"}
              </button>
            </div>
            {message && (
              <p className="mt-2 text-center text-base text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-base text-red-600">{error}</p>
            )}
          </form>

          <p className="mt-10 text-center text-base text-gray-500">
            Zaten bir hesabınız var mı?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:text-indigo-500 text-base"
            >
              Giriş yapın
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
