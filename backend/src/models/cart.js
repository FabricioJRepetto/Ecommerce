const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    products: [
      {     
            product_name: String,
            product_id: String,
            img: [String],
            price: Number,
            stock: Number,
            quantity: Number,
      }
    ],
    owner: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true }
  }
);

cartSchema.virtual('total').get(function() {
    let total = 0;
    this.products.forEach(p => {
        total += p.price * p.quantity;
    });
    return total;
});
module.exports = model("Cart", cartSchema);
