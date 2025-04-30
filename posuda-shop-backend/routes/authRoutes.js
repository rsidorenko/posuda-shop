const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const JWT_SECRET = "jwt-secret-key"; // замени потом на безопасную переменную окружения

// Регистрация
router.post("/register", async (req, res) => {
    const {  name, email, password } = req.body;
    console.log("Тело запроса:", req.body);

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({  name, email, password: hashedPassword });

        res.status(201).json({ message: "Пользователь создан" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка регистрации" });
    }
});

// Вход
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Неверный логин или пароль" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Неверный логин или пароль" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка входа" });
    }
});

module.exports = router;
