import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
    });

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/");
            return;
        }
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await API.get(`/products/${id}`);
            setFormData(res.data);
        } catch (err) {
            console.error("Ошибка загрузки товара", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/products/${id}`, formData);
            alert("Товар обновлён!");
            navigate("/admin/products");
        } catch (err) {
            alert("Ошибка при обновлении товара");
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Название товара"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Цена"
                    value={formData.price}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Ссылка на изображение"
                    value={formData.image}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <textarea
                    name="description"
                    placeholder="Описание"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    rows="4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Сохранить изменения
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;
