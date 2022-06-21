const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      //  required: true,
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
    attributes: [
      {
        value_name: String,
        name: String,
      },
    ],
    //attributes: [String],
    main_features: [String],
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
