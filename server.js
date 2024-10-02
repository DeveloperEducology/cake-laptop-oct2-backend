if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const port = 3001;
const auth = require("./src/middleware/auth");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./src/config/database");
const my_routes = require("./src/routes");

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.use("/", my_routes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
