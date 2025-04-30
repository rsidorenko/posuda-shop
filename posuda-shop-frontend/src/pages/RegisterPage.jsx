import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    console.log("Отправка:", { name, email, password });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", { name, email, password });
            toast.success("Регистрация прошла успешно!");
            navigate("/login");
        } catch (err) {
            toast.error("Ошибка регистрации. Возможно, такой пользователь уже есть.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center pt-20 min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border p-2 mb-4 rounded"
                />
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
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Зарегистрироваться
                </button>

                <p className="text-center mt-4 text-sm">
                    Уже есть аккаунт?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Войти
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
