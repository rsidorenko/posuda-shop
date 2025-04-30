const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // всё ок, пропускаем дальше
    } else {
        res.status(403).json({ message: "Доступ запрещён: только для администраторов" });
    }
};

module.exports = isAdmin;
