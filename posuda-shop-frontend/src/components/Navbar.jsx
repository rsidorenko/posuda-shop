import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-600 hover:text-black";

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center mb-6">
            {/* Левая часть */}
            <NavLink to="/" className="text-2xl font-bold text-blue-600">
                Магазин посуды
            </NavLink>

            {/* Правая часть */}
            <div className="flex items-center gap-6">
                <NavLink to="/" className={linkClass}>
                    Главная
                </NavLink>

                <NavLink to="/cart" className={({ isActive }) =>
                    `relative ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-black"}`
                }>
                    🛒 Корзина
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {cart.length}
                        </span>
                    )}
                </NavLink>

                {!user ? (
                    <NavLink to="/login" className={linkClass}>
                        Авторизоваться
                    </NavLink>
                ) : (
                    <>
                        <NavLink to="/profile" className={linkClass}>
                            Профиль
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-black"
                        >
                            Выйти
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
