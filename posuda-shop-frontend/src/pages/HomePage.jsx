import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useCart } from "../context/CartContext";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortPrice, setSortPrice] = useState(""); // "asc" | "desc" | ""
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Количество товаров на странице

    useEffect(() => {
        API.get("/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error("Ошибка загрузки товаров:", err));
    }, []);

    const user = JSON.parse(localStorage.getItem("user")); // получаем user из localStorage

    const handleDelete = async (id) => {
        if (window.confirm("Точно удалить товар?")) {
            try {
                await API.delete(`/products/${id}`);
                setProducts((prev) => prev.filter((item) => item._id !== id));
                alert("Товар удалён");
            } catch (err) {
                alert("Ошибка при удалении товара");
            }
        }
    };

    // Фильтрация и сортировка товаров
    const filteredProducts = products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortPrice === "asc") return a.price - b.price;
            if (sortPrice === "desc") return b.price - a.price;
            return 0;
        });

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Все товары</h2>

            {/* Поиск и сортировка */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <select
                    value={sortPrice}
                    onChange={(e) => setSortPrice(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Сортировать по цене</option>
                    <option value="asc">Цена: по возрастанию</option>
                    <option value="desc">Цена: по убыванию</option>
                </select>
            </div>

            {/* Список товаров */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentProducts.map((p) => (
                    <div key={p._id} className="border rounded-xl shadow p-4 flex flex-col relative">
                        {p.image && (
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                        )}
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        <p className="text-gray-600">{p.description}</p>
                        <p className="font-bold mt-2">{p.price} ₽</p>

                        <button
                            onClick={() => addToCart(p)}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            В корзину
                        </button>

                        {/* Кнопка удаления только для администратора */}
                        {user?.isAdmin && (
                            <button
                                onClick={() => handleDelete(p._id)}
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Пагинация */}
            <div className="flex justify-center mt-6">
                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`mx-1 px-3 py-1 rounded ${
                            currentPage === num ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
