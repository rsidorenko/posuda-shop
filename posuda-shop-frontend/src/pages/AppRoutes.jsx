import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
    </Routes>
);

export default AppRoutes;
