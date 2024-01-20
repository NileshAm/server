require("dotenv").config();
const mysql = require("mysql");

const connectDB = () =>{
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

    return connection;
}

module.exports ={
    connectDB
}


