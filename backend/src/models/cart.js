const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    products: [
      {
            product_name: String,
            product_id: String,
            price: Number,
            quantity: Number,
      },
    //   {
    //     productId: {
    //       ref: "Product",
    //       type: Schema.Types.ObjectId,
    //       require: true,
    //     },
    //     quantity: Number,
    //   },
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
