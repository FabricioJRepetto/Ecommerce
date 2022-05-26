const {Schema, model} = require("mongoose");

const product = new Schema({
    name: String,
    price: Number,
    description: String,
    attributes: [String],
    main_features: [String],
    imgURL: String
}, {
    versionKey: false
});

module.exports = model("Product", product);
