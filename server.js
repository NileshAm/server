const express = require("express");

const fileUpload = require("express-fileupload");
const firebaseUploader = require("./Utils/FirebaseUploader");

const connection = require("./Utils/DatabaseConnection").connectDB();

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

app.use(fileUpload());

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
        res.status(500).json({ error: "Failed to execute query" });
      } else {
        res.status(200).json(result);
      }
    });
  }
  if (req.params.inqury == "banner") {
    connection.query("SELECT * FROM Banners", (err, result) => {
      if (err) {
        console.error(`Error fetching data : ${err}`);
        res.status(500).json({ error: "Failed to execute query" });
      } else {
        res.status(200).json(result);
      }
    });
  }
});

app.post("/api/img", (req, res) => {
  if (req.files != null) {
    const rating = Math.floor(Math.random() * 6);
    file = req.files;
    data = req.body;

    connection.query(`CALL VerifyProduct('${data.name}')`, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ result: err, code: 500 });
      } else if (result[0][0].Products === 1) {
        res
          .status(208)
          .json({ result: "Items already in Database", code: 208 });
      } else {
        firebaseUploader.FirebaseUpload(file.image).then((responce) => {
          if (responce.code === 200) {
            connection.query(
              `CALL InsertProduct('${data.name}', '${data.description}', ${data.price}, ${data.discount}, ${rating}, ${data.quantity}, '${responce.img_url}')`,
              (err, result) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ result: err, code: 500 });
                } else {
                  if (result.affectedRows === 1) {
                    res
                      .status(201)
                      .json({ result: "Items Succesfully created", code: 201 });
                  } else {
                    console.err(
                      "error occuered while inserting  data to database"
                    );
                    res.status(500).json({
                      result:
                        "error occuered while inserting  data to database",
                      code: 500,
                    });
                  }
                }
              }
            );
          } else {
            console.err(responce.error);
            res.status(500).json({ result: responce.error, code: 500 });
          }
        });
      }
    });
  } else {
    res.status(204).json({ Result: "Incomplete content sent", code: 204 });
  }
});

app.get("/login/", (req, res) => {
  res.status(205).json({ User: req.params.user });
});

app.get("/test", (req, res)=>{
  res.status(200).json({ State : "Working...", code : 200})
})

app.get("/product", async (req, res) => {
  connection.query(`select * from Product where ID = ${req.query.id}` , (err, result)=>{
    if(err){
      res.status(500).json({message : {err}, code :500})
    }else{
      res.status(200).json(result)
    }

  })
});

app.listen(PORT, () => {
  console.log(`Lisening to port ${PORT}`);
});
