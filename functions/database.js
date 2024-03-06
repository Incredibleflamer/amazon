//==================== imports ====================
const mongoose = require("mongoose");
const { productSchema } = require("../schema/products");
const Product = mongoose.model("Product", productSchema);
// image
const imgbbUploader = require("imgbb-uploader");

//==================== functions ====================
async function product_add(
  name,
  imagedata,
  description,
  category,
  price,
  api_key
) {
  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      throw new Error("Product with the same name already exists.");
    }

    const image = await upload_image_to_database(
      imagedata.data,
      imagedata.name,
      api_key
    );
    if (image === null || undefined) {
      throw new Error("Failed To Upload Image");
    }

    const product_add = new Product({
      name,
      image,
      description,
      category,
      price,
    });
    await product_add.save();
  } catch (error) {
    throw new Error(error.message);
  }
}
async function upload_image_to_database(imageBuffer, imagename, api_key) {
  try {
    imagename = imagename.replace(/\..+$/, "");
    const base64String = imageBuffer.toString("base64");
    const result = await imgbbUploader({
      apiKey: api_key,
      base64string: base64String,
      name: imagename,
    });
    return result.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

async function product_fetch() {}
async function get_all_products() {}
//==================== exports ====================
module.exports = { product_add, product_fetch, get_all_products };
