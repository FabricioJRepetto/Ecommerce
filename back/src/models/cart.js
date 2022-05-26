const {Schema, model} = require("mongoose");

const cart = new Schema({
    products: [{
        productId: String,
        quantity: Number
    }],
    user: {
        ref: "User",
        type: Schema.Types.ObjectId
    }
}, {
    versionKey: false
});

module.exports = model("Cart", cart);