import React, { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
    };

    const clearCart = () => {
        setCart([]);
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};

// 🛠 Вот этот хук и нужно было добавить
export const useCart = () => useContext(CartContext);
