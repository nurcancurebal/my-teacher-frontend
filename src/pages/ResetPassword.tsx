import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { isAxiosError } from "axios";

import API from "../api";

import { TQueryPasswordParams } from "../types";

function ResetPassword() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state as TQueryPasswordParams;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [newPasswordRepeat, setnewPasswordRepeat] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== newPasswordRepeat) {
      setError("Şifreler eşleşmiyor. Lütfen kontrol edin.");
      setLoading(false);
      return;
    }

    try {
      await API.auth.resetPassword({ email, password, otp });
      setMessage(
        "Şifreniz başarıyla değiştirildi. Giriş yapmak için yönlendiriliyorsunuz..."
      );
      setTimeout(() => {
        navigate("/login");
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
            Şifremi Sıfırla
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                readOnly
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-gray-900"
                >
                  Yeni Şifre
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="newPasswordRepeat"
                  className="block text-lg font-medium text-gray-900"
                >
                  Yeni Şifre Tekrar
                </label>
              </div>
              <input
                id="newPasswordRepeat"
                name="newPasswordRepeat"
                type="password"
                required
                value={newPasswordRepeat}
                onChange={(e) => setnewPasswordRepeat(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="otp"
                  className="block text-lg font-medium text-gray-900"
                >
                  OTP Kodu
                </label>
              </div>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? "Şifre değiştiriliyor..." : "Şifremi Sıfırla"}
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
            Üye değil misiniz?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-500 text-base"
            >
              Şimdi kaydolun
            </button>
          </p>
          <p className="mt-4 text-center text-base text-gray-500">
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

export default ResetPassword;
