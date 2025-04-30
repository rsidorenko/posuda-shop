const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Обновление профиля пользователя (например, имени)
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        user.name = req.body.name || user.name;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;
