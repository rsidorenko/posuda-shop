const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            name: String,
            price: Number,
            _id: false, // чтобы не генерировался под-ObjectId
        },
    ],
    total: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
