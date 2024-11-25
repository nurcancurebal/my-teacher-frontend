import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../services/axiosInstance";

interface LocationState {
  email: string;
}

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const { email } = location.state as LocationState;

  const [password, setPassword] = useState<string>("");
  const [newPasswordRepeat, setnewPasswordRepeat] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault(); // Varsayılan form gönderim davranışını engeller
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== newPasswordRepeat) {
      setError("Şifreler eşleşmiyor. Lütfen kontrol edin.");
      setLoading(false);
      return;
    }

    try {
      await instance.post("auth/reset-password", { email, password, otp });
      setMessage(
        "Şifreniz başarıyla değiştirildi. Giriş yapmak için yönlendiriliyorsunuz..."
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case "Otp code is invalid.":
            setError("OTP kodu geçersiz. Lütfen kontrol edin.");
            break;
          case '"password" length must be at least 8 characters long':
            setError("Şifre en az 8 karakter uzunluğunda olmalıdır.");
            break;
          case "The password must contain at least one letter and one number.":
            setError("Şifre en az bir harf ve bir rakam içermelidir.");
            break;
          case '"otp" length must be 6 characters long':
            setError("OTP kodu 6 karakter uzunluğunda olmalıdır.");
            break;
          default:
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Şifremi Sıfırla
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  readOnly
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Yeni Şifre
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Yeni Şifre Tekrar
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="newPasswordRepeat"
                  name="newPasswordRepeat"
                  type="password"
                  required
                  value={newPasswordRepeat}
                  onChange={(e) => setnewPasswordRepeat(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  OTP Kodu
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? "Şifre değiştiriliyor..." : "Şifremi Sıfırla"}
              </button>
            </div>
            {message && (
              <p className="mt-2 text-center text-sm/6 text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-sm/6 text-red-600">{error}</p>
            )}
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Üye değil misiniz?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Şimdi kaydolun
            </button>
          </p>
          <p className="mt-4 text-center text-sm/6 text-gray-500">
            Zaten bir hesabınız var mı?{" "}
            <button
              onClick={() => navigate("/")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
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
