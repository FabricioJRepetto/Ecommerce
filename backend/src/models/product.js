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
    sale_price: {
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
    description: {
      type: String,
      required: true,
    },
    free_shipping: {
      type: Boolean,
      required: true,
      default: false,
    },
    main_features: [String],
    attributes: [
      {
        value_name: String,
        name: String,
      },
    ],
    //category: String,
    available_quantity: Number,
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
    toObject: { getters: true, virtuals: true }
  }
);

productSchema.virtual('discount').get(function() {
    return (`${(100 - Math.round((this.sale_price / this.price) * 100))}%`);
});

module.exports = model("Product", productSchema);
