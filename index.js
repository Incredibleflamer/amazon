//==================== importing libs ====================
const express = require("express");
const compression = require("compression");
const session = require("express-session");
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
const { productSchema } = require("./schema/products");
const Product = mongoose.model("Product", productSchema);
mongoose
  .connect(config.mongodb_url)
  .then(() => console.log("The Website is now connected to mongodb"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));
//==================== setting up middle ware ====================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);
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
// api product add
app.post("/api/productadd", async (req, res) => {});
// api product remove
app.post("/api/productremove", async (req, res) => {});
// api product list
app.post("/api/products", async (req, res) => {});
// api product info
app.post("/api/productinfo:productname", async (req, res) => {});
//==================== routes ====================
// main page
app.get("/", async (req, res) => {});
//==================== admin page api ====================
// function to check logged in or not
const checkAdminAuth = (req, res, next) => {
  if (req.session.user === "admin" && req.session.password === "1234") {
    next();
  } else {
    res.redirect("/admin");
  }
};
// post request for checking pass and username
app.post("/login", async (req, res) => {
  let Username = req.body.Username;
  let password = req.body.password;

  if (Username && password) {
    if (Username === "admin") {
      if (password === "1234") {
        req.session.user = "admin";
        req.session.password = "1234";
        res.redirect("/dashboard");
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
// post request for adding product to database
app.post("/api/productadd", async (req, res) => {});
//==================== admin page routes ====================
// admin page
app.get("/admin", async (req, res) => {
  if (req.session.user === "admin" && req.session.password === "1234") {
    res.redirect("/dashboard");
  } else {
    res.render("pages/admin_login.ejs", {
      error: "",
    });
  }
});
// admin logout
app.get("/admin_logout", async (req, res) => {
  req.session.user = "";
  req.session.password = "";
  res.redirect("pages/admin_login.ejs");
});
// dashboard
app.get("/dashboard", async (req, res) => {
  res.render("pages/dashboard.ejs");
});
// product add
app.get("/productadd", async (req, res) => {
  res.render("pages/newproductadd.ejs");
});
// error page
app.get("*", async (req, res) => {
  res.render("pages/404.ejs");
});
//==================== starting express server ====================
app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
