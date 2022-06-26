const { Schema, model } = require("mongoose");

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
cartSchema.virtual('total').get(function() {
    let total = 0;
    this.products.forEach(p => {
        total += (p.on_sale ? p.sale_price : p.price) * p.quantity;
    });
    return total;
});

cartSchema.virtual('id_list').get(function() {
    return this.products?.map(p => p.product_id);
});

cartSchema.virtual('free_ship_cart').get(function() {
    let aux = false;
    this.products.forEach(p => {
        p.free_shipping && (aux = true);
    });
    return aux;
});

module.exports = model("Cart", cartSchema);