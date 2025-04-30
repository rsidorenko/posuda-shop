import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-hot-toast";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(res.data));
            toast.success("Успешный вход!");
            navigate("/profile");
        } catch (err) {
            toast.error("Ошибка входа. Проверьте email и пароль.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center pt-20 min-h-screen bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border p-2 mb-4 rounded"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border p-2 mb-4 rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Войти
                </button>

                <p className="text-center mt-4 text-sm">
                    Нет аккаунта?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
