const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GoogleUserSchema = new Schema({
  _id: {
    //! sub
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  name: {
    //! name
    type: String,
    required: true,
  },
  avatar: String, //! picture,
  isUserGoogle: {
    type: Boolean,
    default: true,
  },
  /*     orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ], */
});

module.exports = mongoose.model("GoogleUser", GoogleUserSchema);
