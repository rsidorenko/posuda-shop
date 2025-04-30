import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import HomePage from "./pages/HomePage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import EditProductPage from "./pages/EditProductPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/add-product" element={<AdminProductPage />} />
                <Route path="/admin/edit-product/:id" element={<EditProductPage />} />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
