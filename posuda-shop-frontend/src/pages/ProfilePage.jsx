import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const [orders, setOrders] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            loadOrders();
        }
    }, []);

    const loadOrders = async () => {
        try {
            const res = await API.get("/orders/my");
            setOrders(res.data);
        } catch (err) {
            console.error("Ошибка при получении заказов", err);
        }
    };

    const handleNameChange = async () => {
        if (!name.trim()) return toast.error("Имя не может быть пустым");
        try {
            setLoading(true);
            const res = await API.put("/users/profile", { name });
            const updatedUser = res.data;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("Имя обновлено!");
        } catch (err) {
            toast.error("Ошибка при обновлении имени");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Профиль</h2>

            <div className="mb-8">
                <label className="block text-sm font-medium mb-1">Ваше имя:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={handleNameChange}
                    disabled={loading}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Сохранить изменения
                </button>
            </div>

            <h3 className="text-xl font-semibold mb-4">История заказов</h3>
            {orders.length === 0 ? (
                <p>У вас пока нет заказов</p>
            ) : (
                orders.map((order, index) => (
                    <div key={index} className="border rounded p-4 mb-4">
                        <p className="font-semibold mb-2">
                            Заказ от {new Date(order.date).toLocaleString()}
                        </p>
                        <ul className="text-sm space-y-1">
                            {order.items.map((item, i) => (
                                <li key={i}>
                                    {item.name} — {item.price} ₽
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 font-bold">Итого: {order.total} ₽</p>
                    </div>
                ))
            )}
        </div>
    );
}
