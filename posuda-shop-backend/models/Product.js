const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // можно URL картинки
    description: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
