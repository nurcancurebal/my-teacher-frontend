import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import instance from "../services/axiosInstance";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Varsayılan form gönderim davranışını engeller
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await instance.post("auth/login", { email, password });

      setMessage("Giriş başarılı. Yönlendiriliyorsunuz...");
      localStorage.setItem("token", response.data.accessToken);
      setTimeout(() => navigate("/onizleme"), 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case "Email is incorrect":
            setError("E-posta adresi hatalı.");
            break;
          case "Password is incorrect":
            setError("Şifre hatalı.");
            break;
          case '"email" must be a valid email':
            setError("Geçerli bir e-posta adresi giriniz.");
            break;
          case '"password" length must be at least 8 characters long':
            setError("Şifre en az 8 karakter uzunluğunda olmalıdır.");
            break;
          case "The password must contain at least one letter and one number.":
            setError("Şifre en az bir harf ve bir rakam içermelidir.");
            break;
          default:
            setError(
              "Giriş başarısız. Lütfen email ve şifrenizi kontrol edin."
            );
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Hesabınıza giriş yapın
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-900"
              >
                Email adresi
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
                <button
                  onClick={() => navigate("/parolami-unuttum")}
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 text-base"
                >
                  Şifrenizi mi unuttunuz?
                </button>
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
                {loading ? "Giriş yapılıyor..." : "Giriş yap"}
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
        </div>
      </div>
    </>
  );
};

export default Login;
