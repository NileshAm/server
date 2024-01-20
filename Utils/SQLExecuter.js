
const query = (responce, connection, query) => {
  connection.query(query, (err, result) => {
    if (err) {
      console.error(`Error fetching data : ${err}`);
      return responce.status(500).json({ error: "Failed to execute query" });
    }
    responce.status(200).json(result);
  });
}


module.exports ={
    query
}