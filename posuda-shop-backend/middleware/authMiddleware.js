const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "jwt-secret-key"; // TODO: заменить на .env

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Нет токена" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) throw new Error("Пользователь не найден");

        next();
    } catch (err) {
        res.status(401).json({ message: "Недействительный токен" });
    }
};

module.exports = authMiddleware;
