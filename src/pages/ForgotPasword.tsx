import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../services/config";

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleForgotPassword = async (event: React.FormEvent) => {

        event.preventDefault(); // Varsayılan form gönderim davranışını engeller
        setLoading(true);
        setMessage('');
        setError("");

        if (!validateEmail(email)) {
            setError("Lütfen geçerli bir e-posta adresi yazınız.");
            setLoading(false);
            return;
        }

        try {
            await config.post("auth/forgot-password", { email });
            setMessage("OTP kodu email adresinize gönderildi. Lütfen kodu kullanarak şifrenizi değiştirin.");
            setTimeout(() => {
                navigate("/reset-password", { state: { email } }); // Başarılı girişten 5 saniye sonra yönlendirme
            }, 5000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (errorMessage === "Email is incorrect") {
                    setError("E-posta adresi hatalı.");
                } else if (errorMessage === "Failed to send OTP") {
                    setError("OTP kodu gönderilemedi. Lütfen tekrar deneyin.");
                }
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
                        Şifremi Unuttum
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
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
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={loading}
                            >
                                {loading ? "Kod gönderiliyor..." : "Şifre Sıfırlama Kodu Gönder"}
                            </button>
                        </div>
                        {message && <p className="mt-2 text-center text-sm/6 text-green-600">{message}</p>}
                        {error && <p className="mt-2 text-center text-sm/6 text-red-600">{error}</p>}
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Üye değil misiniz?{' '}
                        <button onClick={() => navigate("/register")} className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Şimdi kaydolun
                        </button>
                    </p>
                    <p className="mt-4 text-center text-sm/6 text-gray-500">
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

export default ForgotPassword;