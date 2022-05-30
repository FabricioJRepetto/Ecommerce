const { Schema, model } = require("mongoose");

const whishlistSchema = new Schema(
  {
    products: [ String ],
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
