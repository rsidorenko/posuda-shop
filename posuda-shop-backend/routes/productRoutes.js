const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// 🟢 GET /api/products — получить список товаров
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении товаров" });
    }
});

// 🔴 POST /api/products — добавить товар (только авторизованным)
router.post("/", auth, isAdmin, async (req, res) => {
    const { name, price, image, description } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: "Имя и цена обязательны" });
    }

    try {
        const product = await Product.create({ name, price, image, description });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при добавлении товара" });
    }
});

// ❌ DELETE /api/products/:id — удалить товар (только админ)
router.delete("/:id", auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }
        res.json({ message: "Товар успешно удалён" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при удалении товара" });
    }
});


module.exports = router;
