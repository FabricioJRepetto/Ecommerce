const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        on_sale: {
            type: Boolean,
            default: false,
        },
        brand: {
            type: String,
            required: true,
        },
        main_features: [String],
        attributes: [
            {
                value_name: String,
                name: String,
            },
        ],
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: "categoria",
        },
        path_from_root: [String],
        available_quantity: Number,
        free_shipping: Boolean,
        images: [
            {
                imgURL: String,
                public_id: String,
            },
        ],
    },
    {
        versionKey: false,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

productSchema.virtual("sale_price").get(function () {
    return this.price - this.price * (this.discount / 100);
});
productSchema.virtual("thumbnail").get(function () {
    return this.images[0].imgURL;
});

module.exports = model("Product", productSchema);
