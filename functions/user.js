//==================== imports ====================
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../schema/user");
const user = mongoose.model("User", userSchema);
//==================== functions ====================

async function create_user(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new user({ username, email, password: hashedPassword });
  await newUser.save();
  return newUser._id;
}

async function user_info(userId) {
  return await user.findOne({ _id: userId });
}

async function cart_add(userId, productName, quantity) {
  try {
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      throw new Error("User not found.");
    }
    foundUser.cart.push({ productName: productName, quantity: quantity });
    await foundUser.save();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function cart_remove(userId, productName) {
  try {
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      throw new Error("User not found.");
    }
    foundUser.cart = foundUser.cart.filter(
      (item) => item.productName !== productName
    );
    await foundUser.save();
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
module.exports = { create_user, user_info, cart_add, cart_remove, find_user };
