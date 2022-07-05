const { Schema, model } = require("mongoose");
const { SHIP_COST } = require("../../constants");

const cartSchema = new Schema(
    {
        products: [
            {
                product_name: String,
                product_id: String,
                description: String,
                img: String,
                price: Number,
                sale_price: Number,
                brand: String,
                stock: Number,
                discount: String,
                quantity: Number,
                free_shipping: Boolean,
                on_sale: Boolean
            }
        ],
        buyNow: String,
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

// tiene que ser 'function', no funciona con una '() =>'
cartSchema.virtual('id_list').get(function () {
    return this.products?.map(p => p.product_id);
});

cartSchema.virtual('total').get(function () {
    let total = 0;
    this.products.forEach(p => {
        total += ((p.on_sale ? p.sale_price : p.price) * p.quantity) + (p.free_shipping ? 0 : SHIP_COST);
    });
    return total;
});

cartSchema.virtual('shipping_cost').get(function () {
    let total = 0;
    this.products.map(e => (
        e.free_shipping || (total += SHIP_COST)
    ));
    return total;
});

cartSchema.virtual('free_ship_cart').get(function () {
    let aux = false;
    this.products.forEach(p => {
        p.free_shipping && (aux = true);
    });
    return aux;
});

module.exports = model("Cart", cartSchema);