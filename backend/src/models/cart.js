const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    products: [
      {
            product_name: String,
            product_id: String,
            img: [String],
            price: Number,
            quantity: Number,
      }
    ],
    owner: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Cart", cartSchema);
