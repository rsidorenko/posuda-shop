import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function CartPage() {
    const { cart, total, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState("");

    const handleOrder = async () => {
        try {
            const order = {
                items: cart,
                total,
                date: new Date(),
            };

            await API.post("/orders", order); // backend: сохранить заказ

            setMessage("Заказ успешно оформлен!");
            clearCart();
        } catch (err) {
            setMessage("Ошибка при оформлении заказа");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Корзина</h2>

            {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}

            {cart.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <div>
                    <ul className="space-y-2">
                        {cart.map((item, index) => (
                            <li key={index} className="flex justify-between border-b py-2">
                                <span>{item.name}</span>
                                <span>{item.price} ₽</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 font-bold text-lg">
                        Итоговая сумма: {total} ₽
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={clearCart}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Очистить корзину
                        </button>
                        <button
                            onClick={handleOrder}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
