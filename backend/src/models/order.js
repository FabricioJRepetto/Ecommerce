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
        googleUser: {
            type: Schema.Types.ObjectId,
            ref: "GoogleUser",
        },
        shipping_address: {
            state: String,
            city: String,
            zip_code: String,
            street_name: String,
            street_number: Number,
        },
        expiration_date: {
            from: String,
            to: String
        },
        total: Number,
        status: String,
        free_shipping: Boolean,
        shipping_cost: Number,
        order_type: String,
        payment_link: String,
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
    // convierte la zonahoraria a -3
    this.expiration_date.from = new Date(Date.now() - 10800000).toISOString().slice(0, -1) + '-03:00';
    this.expiration_date.to = new Date(Date.now() + 248400000).toISOString().slice(0, -1) + '-03:00';

    next();
})

// 2022-07-19T13:55:11.111-03:00 10800000
module.exports = model("Order", orderSchema);
