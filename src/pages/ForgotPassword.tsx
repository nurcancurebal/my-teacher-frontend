import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await API.auth.forgotPassword({ email });
      setMessage(
        "OTP kodu email adresinize gönderildi. Şifrenizi sıfırlamak için yönlendiriliyorsunuz..."
      );
      setTimeout(() => {
        navigate("/sifremi-sifirla", { state: { email } });
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Şifremi Unuttum
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleForgotPassword} className="space-y-6">
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
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base p-3"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading
                  ? "Kod gönderiliyor..."
                  : "Şifre Sıfırlama Kodu Gönder"}
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
              onClick={() => navigate("/kayit-ol")}
              className="font-semibold text-indigo-600 hover:text-indigo-500 text-base"
            >
              Şimdi kaydolun
            </button>
          </p>
          <p className="mt-4 text-center text-base text-gray-500">
            Zaten bir hesabınız var mı?{" "}
            <button
              onClick={() => navigate("/")}
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

export default ForgotPassword;
