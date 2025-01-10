import React, { useState, useEffect } from "react";
import axios from "axios";

import instance from "../services/axiosInstance";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: Date;
  last_updated: Date;
}

interface UpdateProfileProps {
  userData: User | null;
  onProfileUpdate: () => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({
  userData,
  onProfileUpdate,
}) => {
  const [error, setError] = useState<string | null>(null);

  const [firstname, setFirstname] = useState<string>(userData?.firstname || "");
  const [lastname, setLastname] = useState<string>(userData?.lastname || "");
  const [username, setUsername] = useState<string>(userData?.username || "");
  const [email, setEmail] = useState<string>(userData?.email || "");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setUsername(userData.username);
      setEmail(userData.email);
    }
  }, [userData]);

  const updateUser = async () => {
    setError("");
    setMessage("");
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
        onProfileUpdate(); // Kullanıcı bilgilerini güncellemek için callback fonksiyonunu çağır
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case "User not found":
            setError("Kullanıcı bulunamadı.");
            break;
          case '"firstname" is not allowed to be empty':
            setError("İsim boş bırakılamaz.");
            break;
          case '"firstname" length must be at least 3 characters long':
            setError("İsim en az 3 karakter uzunluğunda olmalıdır.");
            break;
          case '"firstname" length must be less than or equal to 30 characters long':
            setError("İsim en fazla 30 karakter uzunluğunda olmalıdır.");
            break;
          case '"lastname" is not allowed to be empty':
            setError("Soyisim boş bırakılamaz.");
            break;
          case '"lastname" length must be at least 3 characters long':
            setError("Soyisim en az 3 karakter uzunluğunda olmalıdır.");
            break;
          case '"lastname" length must be less than or equal to 30 characters long':
            setError("Soyisim en fazla 30 karakter uzunluğunda olmalıdır.");
            break;
          case '"username" is not allowed to be empty':
            setError("Kullanıcı adı boş bırakılamaz.");
            break;
          case '"username" length must be at least 3 characters long':
            setError("Kullanıcı adı en az 3 karakter uzunluğunda olmalıdır.");
            break;
          case '"username" length must be less than or equal to 30 characters long':
            setError(
              "Kullanıcı adı en fazla 30 karakter uzunluğunda olmalıdır."
            );
            break;
          case '"email" is not allowed to be empty':
            setError("E-posta boş bırakılamaz.");
            break;
          case '"email" must be a valid email':
            setError("Geçerli bir e-posta adresi giriniz.");
            break;
          case "Email already exists":
            setError("Bu e-posta adresi zaten kullanımda.");
            break;
          case '"password" is not allowed to be empty':
            setError("Şifre boş bırakılamaz.");
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
            console.log(errorMessage);
            setError(
              "Bir hata oluştu. Lütfen tekrar deneyin veya daha sonra tekrar deneyin."
            );
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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
