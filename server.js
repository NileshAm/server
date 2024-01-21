const express = require("express");
require("dotenv").config();

const fileUpload = require("express-fileupload");
const firebaseUploader = require("./Utils/FirebaseUploader")

const PORT = process.env.PORT;

const app = express();
const cors = require("cors");


app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(fileUpload());

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
  if (req.params.inqury == "banner") {
    SQLExecuter.query(res, connection, "SELECT * FROM Banners");
  }
});

app.post("/api/img", (req, res) => {
  if (req.files != null) {
    file = req.files;
    console.log(file.image);
    firebaseUploader.FirebaseUpload(file.image).then((responce)=>{
      // if (responce.code == 200){
      //     res.json({ message: "Uploaded Succesfully", code: 200 });
      // }else{
      //     res.json({ message: "Error occured while converting or uploading", code: 500 });
      // }
      res.json(responce)
    })
    
  } else {
    res.json({ message: "No image received", code: 500 });
  }
});

app.get("/login/:user", (req, res) => {
  res.json({ User: req.params.user });
});

app.listen(PORT, () => {
  console.log(`Lisening to port ${PORT}`);
});
