const express = require("express");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/book");
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use("/", bookRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
