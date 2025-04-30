import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/");
            return;
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Ошибка загрузки товаров");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Удалить товар?")) {
            try {
                await API.delete(`/products/${id}`);
                setProducts(products.filter((p) => p._id !== id));
                alert("Удалено");
            } catch (err) {
                alert("Ошибка при удалении");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление товарами</h1>
                <button
                    onClick={() => navigate("/admin/add-product")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    ➕ Добавить товар
                </button>
            </div>

            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Название</th>
                    <th className="border px-4 py-2">Цена</th>
                    <th className="border px-4 py-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => (
                    <tr key={p._id}>
                        <td className="border px-4 py-2">{p.name}</td>
                        <td className="border px-4 py-2">{p.price} ₽</td>
                        <td className="border px-4 py-2 flex gap-2">
                            <button
                                onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                📝 Редактировать
                            </button>
                            <button
                                onClick={() => handleDelete(p._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                ❌ Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductsPage;
