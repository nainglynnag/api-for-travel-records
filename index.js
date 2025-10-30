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

// JWT
const jwt = require("jsonwebtoken");

// Auth Middlewares
function auth (req,res,next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) return res.sendStatus(401);
  
  // Check if the token is valid
  const [type, token] = authHeader.split(' ');
  if (type !== "Bearer") return res.sendStatus(401);
  
  const secret = process.env.JWT_SECRET;
  
  jwt.verify(token, secret, (err, data) => {
    if (err) return res.sendStatus(401);
    next();
  });
  
}

const authRoutes = require("./routes/users");
const recordRoutes = require("./routes/records");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API routes
app.use("/api/v1", authRoutes)
app.use("/api/v1/records", auth, recordRoutes)

// Server run
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
});
