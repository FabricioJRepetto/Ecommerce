const { Schema, model } = require("mongoose");

const whishlistSchema = new Schema(
  {
    products: [{
        product_name: String,
        product_id: String,
        price: Number,
        img: String
    }],
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

module.exports = model("Whishlist", whishlistSchema);
