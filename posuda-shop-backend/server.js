const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);


// Подключение к MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/posuda-shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Роуты
app.use("/api/auth", require("./routes/authRoutes"));

// Тест
app.get("/", (req, res) => {
    res.send("Backend работает!");
});

app.listen(5000, () => console.log("Сервер запущен на http://localhost:5000"));
