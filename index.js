const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes/records");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API routes
app.use("/api/v1", routes)

// Server run
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
});
