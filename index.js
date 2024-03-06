//==================== importing libs ====================
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
//==================== config ====================
const configData = fs.readFileSync("./config.json");
const config = JSON.parse(configData);
const app = express();
//==================== using imported libs ====================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
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
// error page
app.get("*", async (req, res) => {
  res.render("404.ejs", {});
});
//==================== starting express server ====================
app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
