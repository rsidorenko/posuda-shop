const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

// 📦 POST /api/orders — создать заказ
router.post("/", auth, async (req, res) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Корзина пуста" });
        }

        const order = new Order({
            user: req.user._id,
            items,
            total,
            date: new Date(),
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при создании заказа" });
    }
});

// 📜 GET /api/orders/my — получить заказы текущего пользователя
router.get("/my", auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при получении заказов" });
    }
});

module.exports = router;
