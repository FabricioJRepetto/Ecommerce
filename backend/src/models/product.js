const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    attributes: [String],
    main_features: [String],
    available_quantity: Number,
    images: [{
        imgURL: String,
        public_id: String
  }]
  },
  {
    versionKey: false,
  }
);

module.exports = model("Product", productSchema);
