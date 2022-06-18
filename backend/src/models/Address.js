const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
  {
    address: [{
        state: String,
        city: String,
        zip_code: String,
        street_name: String,
        street_number: Number,
        isDefault: Boolean
    }],
    user: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Address", addressSchema);