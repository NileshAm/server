const express = require("express");
require("dotenv").config();
const mysql = require("mysql");

const PORT = process.env.PORT;

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  })
);

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error(`Error connecting to databses : ${err}`);
    return;
  }
  console.log("Database successfully connected");
});

app.get("/in", (req, res) => {
  let array = req.query.key.replace(/\[|\]/g, "").split(",");
  console.log(array);
  res.sendStatus(200);
});

app.get("/product/:inqury", (req, res) => {
  if (req.params.inqury == "home") {
    connection.query("SELECT * FROM Product", (err, result) => {
      if (err) {
        console.error(`Error fetching data : ${err}`);
        return res.status(500).json({ error: "Failed to execute query" });
      }
      res.json(result);
    });
  }
});

app.get("/login/:user", (req, res) => {
  res.json({ User: req.params.user });
});

app.listen(PORT, () => {
  console.log(`Lisening to port ${PORT}`);
});
