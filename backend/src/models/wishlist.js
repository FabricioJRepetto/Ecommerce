const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
  {
    products: [String],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    googleUser: {
      type: Schema.Types.ObjectId,
      ref: "GoogleUser",
    },
  },
  {
    versionKey: false,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// tiene que ser 'function', no funciona con una '() =>'
// wishlistSchema.virtual('id_list').get(function () {
//     return this.products?.map(p => p.product_id);
// })

module.exports = model("Wishlist", wishlistSchema);
