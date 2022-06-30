const { Schema, model } = require("mongoose");

const whishlistSchema = new Schema(
    {
        products: [String],
        user: String,
    },
    {
        versionKey: false,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true }
    }
);

// tiene que ser 'function', no funciona con una '() =>'
// whishlistSchema.virtual('id_list').get(function () {
//     return this.products?.map(p => p.product_id);
// })

module.exports = model("Whishlist", whishlistSchema);
