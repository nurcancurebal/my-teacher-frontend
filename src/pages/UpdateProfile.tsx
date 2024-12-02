import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import instance from "../services/axiosInstance";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: string;
  last_updated: string;
}

const UpdateProfile: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await instance.get<{ data: User }>("user");
        const userData = user.data.data;
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        setError("Kullanıcı bilgileri alınamadı, lütfen tekrar deneyin.");
        navigate("/dashboard");
      }
    };
    fetchUser();
  }, [navigate]);

  const updateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await instance.patch("user", {
        firstname,
        lastname,
        username,
        email,
        password,
      });
      setMessage("Kullanıcı bilgileri başarıyla güncellendi.");
      setTimeout(() => {
        setMessage(null);
        setPassword("");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case "User not found":
            setError("Kullanıcı bulunamadı.");
            break;
          case '"firstname" length must be at least 3 characters long':
            setError("İsim en az 3 karakter uzunluğunda olmalıdır.");
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
          case "Email already exists":
            setError("Bu e-posta adresi zaten kullanımda.");
            break;
          case '"password" length must be at least 8 characters long':
            setError("Şifre en az 8 karakter uzunluğunda olmalıdır.");
            break;
          case "Password is incorrect":
            setError("Şifre yanlış.");
            break;
          case "The password must contain at least one letter and one number.":
            setError("Şifre en az bir harf ve bir rakam içermelidir.");
            break;
          default:
            setError(
              "Bir hata oluştu. Lütfen tekrar deneyin veya daha sonra tekrar deneyin."
            );
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={updateUser}>
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
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg p-3"
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
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg p-3"
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg p-3"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg p-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xl font-medium text-gray-900"
                >
                  Mevcut Şifre
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg p-3"
                />
              </div>
            </div>

            {message && (
              <p className="mt-2 text-center text-lg text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-lg text-red-600">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="mt-14 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Düzenle
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
