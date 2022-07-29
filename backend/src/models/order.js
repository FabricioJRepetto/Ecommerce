const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        products: [
            {
                product_name: String,
                product_id: String,
                description: String,
                img: String,
                price: Number,
                sale_price: Number,
                quantity: Number,
                on_sale: Boolean,
            },
        ],
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        shipping_address: {
            state: String,
            city: String,
            zip_code: String,
            street_name: String,
            street_number: Number,
        },
        flash_shipping: Boolean,
        expiration_date_from: String,
        expiration_date_to: String,
        created_at: Number,
        payment_date: Number,
        delivery_date: Number,
        total: Number,
        status: String,
        free_shipping: Boolean,
        shipping_cost: Number,
        order_type: String,
        payment_link: String,
        payment_source: String,
    },
    {
        timestamps: false,
        versionKey: false,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

// Order.description
orderSchema.virtual("description").get(function () {
    let desc = "Order summary: ";
    this.products.forEach((product) => {
        desc += `${product.product_name} x${product.quantity}. `;
    });
    return desc;
});

orderSchema.pre('save', async function (next) {
    // convierte la zonahoraria a -3 (-10800000)
    // 36hrs de expiración (stripe no acepta mas de 24hr)
    this.created_at = Date.now() - 10800000;
    this.expiration_date_from = new Date(Date.now() - 10800000).toISOString().slice(0, -1) + '-03:00';
    this.expiration_date_to = new Date(Date.now() + 248400000).toISOString().slice(0, -1) + '-03:00';
    next();
})

module.exports = model("Order", orderSchema);
