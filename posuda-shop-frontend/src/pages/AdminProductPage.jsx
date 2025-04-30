import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
    });

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/"); // редирект если не админ
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/products", {
                ...form,
                price: Number(form.price),
            });
            alert("Товар добавлен!");
            setForm({ name: "", price: "", image: "", description: "" });
        } catch (err) {
            alert("Ошибка добавления товара");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Добавить товар</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Название"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Цена"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Ссылка на изображение"
                    className="border p-2 rounded"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Описание"
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Добавить товар
                </button>
            </form>
        </div>
    );
};

export default AdminProductPage;
