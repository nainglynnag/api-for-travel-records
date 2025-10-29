const express = require("express");
const app = express();

// To allow cors
// Method 1

// app.use((req, res, next) => {
//   res.append("Access-Control-Allow-Origin", "*");
//   res.append("Access-Control-Allow-Methods", "*");
//   res.append("Access-Control-Allow-Headers", "*");
//   next();
// });

// Method 2 - using cors
const cors = require("cors");
app.use(cors());

// cors - customization
// app.use(cors({
//   origin: ["http://abc.com","http://abc.com",],
//   methods: ["GET","POST"],
//   allowedHeaders: ["Authorization","Content-Type"]
// }));

// For query string parsing
app.set('query parser', 'extended');

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
