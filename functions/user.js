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

async function cart_add(userId, productName, quantity) {
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
    const productExistInCart = foundUser.cart.findIndex(
      (item) => item.productName === productName
    );
    console.log(productExistInCart);
    if (productExistInCart !== -1) {
      foundUser.cart[productExistInCart].quantity += quantity;
      foundUser.cart[productExistInCart].amount +=
        productDetails.price * quantity;
    } else {
      foundUser.cart.push({
        productName: productName,
        quantity: quantity,
        amount: productDetails.price * quantity,
      });
    }

    await foundUser.save();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function cart_remove(userId, productName, quantity) {
  try {
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      throw new Error("User not found.");
    }

    const cartItem = foundUser.cart.find(
      (item) => item.productName === productName
    );
    if (!cartItem) {
      throw new Error("Product not found in user's cart.");
    }

    if (quantity) {
      if (quantity <= cartItem.quantity) {
        cartItem.quantity -= quantity;
        cartItem.amount -= cartItem.price * quantity;
        //
        if (cartItem.quantity <= 0) {
          foundUser.cart = foundUser.cart.filter(
            (item) => item.productName !== productName
          );
        }
      } else {
        throw new Error("Quantity to remove exceeds the quantity in the cart.");
      }
    } else {
      foundUser.cart = foundUser.cart.filter(
        (item) => item.productName !== productName
      );
    }

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
