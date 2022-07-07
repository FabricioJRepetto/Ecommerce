const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        products: [{
            product_name: String,
            product_id: String,
            description: String,
            img: String,
            price: Number,
            sale_price: Number,
            quantity: Number,
            on_sale: Boolean,
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
        total: Number,
        status: String,
        free_shipping: Boolean,
        shipping_cost: Number,
        order_type: String,
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true }
    }
);

// Order.description
orderSchema.virtual('description').get(function () {
    let desc = 'Order summary: ';
    this.products.forEach(product => {
        desc += `${product.product_name} x${product.quantity}. `;
    });
    return desc;
});

module.exports = model("Order", orderSchema);
