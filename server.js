const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();


app.get("/login/:user", (req, res)=>{
    res.json({User : req.params.user})
})

app.listen(PORT, () => {
  console.log(`Lisening to port ${PORT}`);
});
