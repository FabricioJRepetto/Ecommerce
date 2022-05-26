const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    attributes: [String],
    main_features: [String],
    imgURL: String,
  },
  {
    versionKey: false,
  }
);

module.exports = model("Schema", productSchema);
