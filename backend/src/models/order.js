const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    products: [{
        product_name: String,
        product_id: String,
        price: Number,
        quantity: Number
    }],
    user: {
        ref: "User",
        type: Schema.Types.ObjectId,
        require: true,
    },
    status: String
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true }
  }
);

// Order.total
orderSchema.virtual('total').get(function() {
    let total = 0;    
    this.products.forEach(product => {
        total += product.price * product.quantity;
    });
    return total;
});

module.exports = model("Order", orderSchema);