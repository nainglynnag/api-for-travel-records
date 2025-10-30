// JWT
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

// Auth Middlewares
function auth (req,res,next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) return res.sendStatus(401);
  
  // Check if the token is valid
  const [type, token] = authHeader.split(' ');
  if (type !== "Bearer") return res.sendStatus(401);
  
  jwt.verify(token, secret, (err, data) => {
    if (err) return res.sendStatus(401);
    next();
  });
  
}

function isAdmin (req,res,next) {
  const [type, token] = req.headers['authorization'].split(' ');
  
  jwt.verify(token, secret, (err, data) => {
    if(err) return res.sendStatus(401);
    
    console.log("data : ", data);
    if (data.role === "admin") next();
    
    // return res.sendStatus(403);
  })
}

module.exports = { auth, isAdmin };