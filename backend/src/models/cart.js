const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    products: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    owner: {
      ref: "User",
      type: Schema.Types.ObjectId,
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Cart", cartSchema);
