const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  })
);

const connection = require("./Utils/DatabaseConnection").connectDB();
const SQLExecuter = require("./Utils/SQLExecuter");

app.get("/in", (req, res) => {
  let array = req.query.key.replace(/\[|\]/g, "").split(",");
  console.log(array);
  res.sendStatus(200);
});

app.get("/product/:inqury", (req, res) => {
  if (req.params.inqury == "home") {
    SQLExecuter.query(res, connection, "SELECT * FROM Product");
  }
});

app.get("/login/:user", (req, res) => {
  res.json({ User: req.params.user });
});

app.listen(PORT, () => {
  console.log(`Lisening to port ${PORT}`);
});
