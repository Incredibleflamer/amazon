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
    cart_total: { type: Number },
    orders: [{ id: { type: String }, totalAmount: { type: Number } }],
  },
  { timestamps: true }
);

module.exports = { userSchema };
