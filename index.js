const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.static("views"));

app.get('/', (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log( `server listening at ${PORT}`);
});