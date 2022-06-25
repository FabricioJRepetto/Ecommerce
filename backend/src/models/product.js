const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
      default: 0,
    },
    on_sale: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    free_shipping: {
      type: Boolean,
      required: true,
      default: false,
    },
    main_features: [String],
    attributes: [
      {
        value_name: String,
        name: String,
      },
    ],
    //attributes: [String],

    available_quantity: Number,
    images: [
      {
        imgURL: String,
        public_id: String,
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = model("Product", productSchema);
