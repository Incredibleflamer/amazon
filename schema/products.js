const { Schema } = require("mongoose");
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    comments: { type: Array },
  },
  { timestamps: true }
);

module.exports = { productSchema };
