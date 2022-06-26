const { Schema, model } = require("mongoose");

const historySchema = new Schema(
  {
    products: [
      {     
            product_name: String,
            product_id: String,
            img: String,
            price: Number,
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


module.exports = model("History", historySchema);