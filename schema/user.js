const { Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: [
      {
        productName: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        amount: {
          type: Number,
        },
      },
    ],
    orders: [
      {
        id: { type: Number },
        totalAmount: { type: Number },
        totalitems: { type: Number },
        product_details: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = { userSchema };
