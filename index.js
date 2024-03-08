//==================== importing libs ====================
const express = require("express");
const compression = require("compression");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
//==================== config ====================
const configData = fs.readFileSync("./config.json");
const config = JSON.parse(configData);
const app = express();
//==================== mongodb ====================
const mongoose = require("mongoose");

mongoose
  .connect(config.mongodb_url)
  .then(() => console.log("The Website is now connected to mongodb"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const {
  product_add,
  get_all_products,
  get_product_by_name,
  get_products_by_category,
} = require("./functions/database");
const {
  create_user,
  user_info,
  cart_add,
  cart_remove,
  find_user,
} = require("./functions/user");
//==================== setting up middle ware ====================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.use(
  session({
    secret: config.cookie_string,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(fileUpload());
// importing footer and navbar
app.use(async (req, res, next) => {
  const navbar = await import_middle_ware("navbar");
  const footer = await import_middle_ware("footer");
  res.locals.navbar = ejs.render(navbar);
  res.locals.footer = ejs.render(footer);
  next();
});

async function import_middle_ware(page) {
  const pagePath = path.join(__dirname, "public", "components", `${page}.ejs`);
  const pageContent = fs.readFileSync(pagePath, "utf-8");
  return pageContent;
}
//==================== api ====================
// api for checking pass and username
app.post("/login", async (req, res) => {
  let Username = req.body.Username;
  let password = req.body.password;

  if (Username && password) {
    if (Username === "admin") {
      if (password === "1234") {
        req.session.user = "admin";
        req.session.password = "1234";
        res.redirect("/productadd");
      } else {
        res.render("pages/admin_login.ejs", {
          error: "Invalid password",
          isLoggedIn: false,
        });
      }
    } else {
      res.render("pages/admin_login.ejs", {
        error: "User with that username does not exist.",
        isLoggedIn: false,
      });
    }
  } else {
    res.render("pages/admin_login.ejs", {
      error: "Please fill in all the fields.",
      isLoggedIn: false,
    });
  }
});
// api for adding product to database
app.post("/api/productadd", async (req, res) => {
  if (
    req.session.user !== config.admin_username ||
    req.session.password !== config.admin_pass
  ) {
    res
      .status(500)
      .json({ error: "Username and password are missing / Invalid." });

    res.status(400).send("Username and password are missing / Invalid.");

    return res.redirect("/admin");
  }
  try {
    const { name, description, category, price } = req.body;
    const images = req.files.productImage;
    await product_add(
      name,
      images,
      description,
      category,
      price,
      config.image_api_key
    );
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// api for signup
app.post("/api/user/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await create_user(username, email, password);
    req.session.userid = user;
    res.redirect("/");
  } catch (err) {
    res.redirect("/login?error=" + encodeURIComponent(err.message));
  }
});
// api for login
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userId = await find_user(email, password);
    req.session.userid = userId;
    res.redirect("/");
  } catch (err) {
    res.redirect("/login?error=" + encodeURIComponent(err.message));
  }
});
// api for fetching user info
app.post("/api/fetch/user", async (req, res) => {
  if (!req.secure.userId) {
    return res.status(401).json({ error: "User is not logged in" });
  } else {
    user = await user_info(req.session.userId);
    return res.status(200).json({ user });
  }
});
// api for cart add
app.post("/api/cart/add", async (req, res) => {
  userId = req.session.userid;
  if (!userId) {
    return res.redirect("/login");
  }
  const { productName, quantity } = req.body;
  try {
    await cart_add(userId, productName, quantity);
    res.status(200).json({ message: "Item added to cart successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// api for cart remove
app.post("/api/cart/remove", async (req, res) => {
  userId = req.session.userid;
  if (!userId) {
    return res.redirect("/login");
  }
  const { productName } = req.body;
  try {
    await cart_remove(userId, productName);
    res.status(200).json({ message: "Item removed from cart successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// api for cart fetch
app.post("/api/cart/fetch", async (req, res) => {
  userId = req.session.userid;
  if (!userId) {
    return res.redirect("/login");
  }
});
//==================== public page routes ====================
// main page
app.get("/", async (req, res) => {
  const productdata = await get_all_products();
  let loggedin, user;
  if (req.session.userid) {
    user = await user_info(req.session.userid);
    if (user) {
      loggedin = true;
    } else {
      loggedin = false;
    }
  } else {
    loggedin = false;
  }
  res.render("pages/index.ejs", {
    products: productdata,
    loggedin: loggedin,
    user: user,
    navbar: res.locals.navbar,
  });
});
// products page
app.get("/products", async (req, res) => {
  const productdata = await get_all_products();
  let loggedin, user;
  if (req.session.userid) {
    user = await user_info(req.session.userid);
    if (user) {
      loggedin = true;
    } else {
      loggedin = false;
    }
  } else {
    loggedin = false;
  }
  res.render("pages/products.ejs", {
    products: productdata,
    loggedin: loggedin,
    user: user,
    navbar: res.locals.navbar,
  });
});
app.get("/gateway", async (req, res) => {
  let loggedin, user;
  if (req.session.userid) {
    user = await user_info(req.session.userid);
    if (user) {
      loggedin = true;
    } else {
      loggedin = false;
    }
  } else {
    loggedin = false;
  }

  if (loggedin === false) {
    res.redirect("/login");
  } else {
    if (user?.cart.length >= 1) {
      res.render("pages/payment.ejs");
    } else {
      res.redirect("/");
    }
  }
});
// login
app.get("/login", async (req, res) => {
  let loggedin, user;
  if (req.session.userid) {
    user = await user_info(req.session.userid);
    if (user) {
      loggedin = true;
    } else {
      loggedin = false;
    }
  } else {
    loggedin = false;
  }
  if (loggedin) {
    res.redirect("/");
  } else {
    res.render("pages/login.ejs", { navbar: res.locals.navbar, page: "login" });
  }
});
// signup
app.get("/signup", async (req, res) => {
  let loggedin, user;
  if (req.session.userid) {
    user = await user_info(req.session.userid);
    if (user) {
      loggedin = true;
    } else {
      loggedin = false;
    }
  } else {
    loggedin = false;
  }
  if (loggedin) {
    res.render("/");
  } else {
    res.render("pages/login.ejs", {
      navbar: res.locals.navbar,
      page: "signup",
    });
  }
});
// profile
app.get("/profile", async (req, res) => {
  let user, loggedin;
  if (req.session.userid) {
    user = await user_info(req.session.userid);
    if (user) {
      loggedin = true;
    } else {
      loggedin = false;
    }
  } else {
    loggedin = false;
  }

  if (loggedin === false) {
    res.redirect("/login");
  } else {
    res.render("pages/profile.ejs", {
      navbar: res.locals.navbar,
      user: user,
    });
  }
});
// product info page
app.get("/product-info/:productname", async (req, res) => {
  const productName = req.params.productname;
  const productdata = await get_product_by_name(productName);
  if (productdata) {
    res.render("pages/productinfo.ejs", {
      product: productdata,
      navbar: res.locals.navbar,
    });
  } else {
    res.redirect("/404");
  }
});
//==================== admin page routes ====================
// admin page
app.get("/admin", async (req, res) => {
  if (
    req.session.user === config.admin_username &&
    req.session.password === config.admin_pass
  ) {
    res.redirect("/productadd", { navbar: res.locals.navbar });
  } else {
    res.render("pages/admin_login.ejs", {
      error: null,
      navbar: res.locals.navbar,
    });
  }
});
// admin logout
app.get("/admin_logout", async (req, res) => {
  req.session.user = "";
  req.session.password = "";
  res.redirect("pages/admin_login.ejs", { navbar: res.locals.navbar });
});
// product add
app.get("/productadd", async (req, res) => {
  if (
    req.session.user === config.admin_username &&
    req.session.password === config.admin_pass
  ) {
    res.render("pages/newproductadd.ejs", { navbar: res.locals.navbar });
  } else {
    res.render("pages/admin_login.ejs", { navbar: res.locals.navbar });
  }
});
//==================== error page routes ====================
app.get("*", async (req, res) => {
  res.render("pages/404.ejs", { navbar: res.locals.navbar });
});
//==================== starting express server ====================
app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
