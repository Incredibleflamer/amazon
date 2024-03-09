//==================== imports ====================
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../schema/user");
const user = mongoose.model("User", userSchema);
const { get_product_by_name } = require("./database");
//==================== functions ====================

async function create_user(username, email, password) {
  const userexists = await user.findOne({ email: email });
  if (userexists) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new user({ username, email, password: hashedPassword });
  await newUser.save();
  return newUser._id;
}

async function user_info(userId) {
  return await user.findOne({ _id: userId });
}

async function cart_update(userId, productName, quantity) {
  try {
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      throw new Error("User not found.");
    }
    const productDetails = await get_product_by_name(productName);
    if (!productDetails) {
      throw new Error("Product not found");
    }
    // find product in user cart
    const productIndex = foundUser.cart.findIndex(
      (item) => item.productName === productName
    );

    if (productIndex !== -1) {
      // If product already exists in cart
      if (quantity === 0) {
        // Remove product if quantity becomes 0
        foundUser.cart.splice(productIndex, 1);
      } else {
        // Update quantity and amount
        foundUser.cart[productIndex].quantity = quantity;
        foundUser.cart[productIndex].amount = productDetails.price * quantity;
      }
    } else {
      // If product doesn't exist in cart, add it
      foundUser.cart.push({
        productName: productName,
        quantity: quantity,
        amount: productDetails.price * quantity,
      });
    }

    await foundUser.save();
    return productDetails.price * quantity;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function find_user(email, password) {
  const userfound = await user.findOne({ email });
  if (!userfound) {
    throw new Error("Invalid email or password.");
  }
  const isPasswordValid = await bcrypt.compare(password, userfound.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }
  return userfound._id;
}
module.exports = { create_user, user_info, cart_update, find_user };
