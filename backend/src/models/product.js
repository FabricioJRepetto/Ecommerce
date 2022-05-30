const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    attributes: [String],
    main_features: [String],
    imgURL: String,
    public_id: String
  },
  {
    versionKey: false,
  }
);

module.exports = model("Product", productSchema);
