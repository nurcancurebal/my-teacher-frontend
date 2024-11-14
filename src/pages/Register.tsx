import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../services/config";

const Register: React.FC = () => {

    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const validateFirstname = (firstname: string) => {
        return firstname.length >= 3 && firstname.length <= 30;
    };
    const validateLastname = (firstname: string) => {
        return firstname.length >= 3 && firstname.length <= 30;
    };
    const validateUsername = (username: string) => {
        return username.length >= 3 && username.length <= 30;
    };
    const validateEmail = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    const validatePassword = (password: string) => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    };

    const handleRegister = async (event: React.FormEvent) => {

        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!validateFirstname(firstname)) {
            setError("İsim en az 3, en fazla 30 karakter uzunluğunda olmalıdır.");
            setLoading(false);
            return;
        }
        if (!validateLastname(lastname)) {
            setError("Soyisim en az 3, en fazla 30 karakter uzunluğunda olmalıdır.");
            setLoading(false);
            return;
        }
        if (!validateUsername(username)) {
            setError("Kullanıcı adı en az 3, en fazla 30 karakter uzunluğunda olmalıdır.");
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError("Lütfen geçerli bir e-posta adresi yazınız.");
            setLoading(false);
            return;
        }
        if (!validatePassword(password)) {
            setError("Şifreniz en az bir harf ve bir rakam içeren ve en az 8 karakter uzunluğunda olmalıdır.");
            setLoading(false);
            return;
        }
        try {
            const response = await config.post("auth/register", { firstname, lastname, username, email, password });
            console.log(response.data);
            setMessage("Kayıt başarılı. Yönlendiriliyorsunuz...");
            localStorage.setItem("token", response.data.accessToken);
            console.log(response.data.accessToken);
            setTimeout(() => {
                navigate("/dashboard");
            }, 5000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError("Giriş başarısız. Lütfen email ve şifrenizi kontrol edin.");
            } else {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Kayıt olun
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label htmlFor="text" className="block text-sm/6 font-medium text-gray-900">
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="text" className="block text-sm/6 font-medium text-gray-900">
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="text" className="block text-sm/6 font-medium text-gray-900">
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="text" className="block text-sm/6 font-medium text-gray-900">
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 p-3"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
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
                                {loading ? "Kayıt işlemi gerçekleştiriliyor..." : "Kayıt ol"}
                            </button>
                        </div>
                        {message && <p className="mt-2 text-center text-sm/6 text-green-600">{message}</p>}
                        {error && <p className="mt-2 text-center text-sm/6 text-red-600">{error}</p>}
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Zaten bir hesabınız var mı?{' '}
                        <button onClick={() => navigate("/")} className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Giriş yapın
                        </button>
                    </p>
                </div>
            </div>
        </>
    )

}

export default Register;