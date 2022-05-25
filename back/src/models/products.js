const mongoose = require("mongoose");

const product = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    attributes: String,
    main_features: [String]
});

module.exports = mongoose.model("Product", product);
