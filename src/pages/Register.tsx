import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import instance from "../services/axiosInstance";

const Register: React.FC = () => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await instance.post("auth/register", {
        firstname,
        lastname,
        username,
        email,
        password,
      });
      setMessage("Kayıt başarılı. Yönlendiriliyorsunuz...");
      localStorage.setItem("token", response.data.accessToken);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case '"firstname" length must be at least 3 characters long':
            setError("İsim en az 3 karakter uzunluğunda olmalıdır.");
            break;
          case "Email is already used":
            setError("Bu e-posta adresi zaten kullanılıyor.");
            break;
          case '"firstname" length must be less than or equal to 30 characters long':
            setError("İsim en fazla 30 karakter uzunluğunda olmalıdır.");
            break;
          case '"lastname" length must be at least 3 characters long':
            setError("Soyisim en az 3 karakter uzunluğunda olmalıdır.");
            break;
          case '"lastname" length must be less than or equal to 30 characters long':
            setError("Soyisim en fazla 30 karakter uzunluğunda olmalıdır.");
            break;
          case '"username" length must be at least 3 characters long':
            setError("Kullanıcı adı en az 3 karakter uzunluğunda olmalıdır.");
            break;
          case '"username" length must be less than or equal to 30 characters long':
            setError(
              "Kullanıcı adı en fazla 30 karakter uzunluğunda olmalıdır."
            );
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
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Kayıt olun
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="text"
                className="block text-xl font-medium text-gray-900"
              >
                İsim
              </label>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  autoComplete="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg p-3"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-xl font-medium text-gray-900"
              >
                Soyisim
              </label>
              <div className="mt-2">
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  autoComplete="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg p-3"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-xl font-medium text-gray-900"
              >
                Kullanıcı adı
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg p-3"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-xl font-medium text-gray-900"
              >
                E-posta
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg p-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xl font-medium text-gray-900"
                >
                  Şifre
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg p-3"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? "Kayıt işlemi gerçekleştiriliyor..." : "Kayıt ol"}
              </button>
            </div>
            {message && (
              <p className="mt-2 text-center text-lg text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-lg text-red-600">{error}</p>
            )}
          </form>

          <p className="mt-10 text-center text-lg text-gray-500">
            Zaten bir hesabınız var mı?{" "}
            <button
              onClick={() => navigate("/")}
              className="font-semibold text-indigo-600 hover:text-indigo-500 text-lg"
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
