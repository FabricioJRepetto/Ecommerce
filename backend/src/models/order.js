const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    products: [{
        product_name: String,
        product_id: String,
        description: String,
        img: String,
        price: Number,
        quantity: Number,
        sale_price: Number,
        free_shipping: Boolean,
    }],
    user: {
        type: String,
        required: true,
    },
    shipping_address: {
        state: String,
        city: String,
        zip_code: String,
        street_name: String,
        street_number: Number,
    },
    status: String,
    free_shipping: Boolean,
    shipping_cost: Number,
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

// Order.description
orderSchema.virtual('description').get(function() {
    let desc = 'Order summary: ';    
    this.products.forEach(product => {
        desc += `${product.product_name} x${product.quantity}. `;
    });
    return desc;
});

module.exports = model("Order", orderSchema);
