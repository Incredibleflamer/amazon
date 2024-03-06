//==================== imports ====================
const mongoose = require("mongoose");
const { userSchema } = require("../schema/user");
const user = mongoose.model("User", userSchema);
//==================== functions ====================

async function cart_fetch(userid) {}

async function create_user() {}

async function user_info() {}

async function cart_add() {}

async function cart_remove() {}

module.exports = { cart_fetch, create_user, user_info, cart_add, cart_remove };
