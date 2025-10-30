const express = require("express");
const router = express.Router();

const { param, body, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

const mongojs = require("mongojs");
const db = mongojs(process.env.MONGO_URL, ["users"]);

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address!"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.users.findOne({ email }, async (err, user) => {
      if(err){
        return res.status(500).json({ meta: { errors: "Database error!" } });
      }
      
      if (!user) {
        return res.status(404).json({meta:{ errors: "User not found!" }});
      }
  
      const isMatch = await bcrypt.compare(password, user.hashedPassword);
  
      if (!isMatch) {
        return res.status(400).json({meta:{ errors: "Invalid credentials!" }});
      }
  
      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      };
  
      try {
        jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
          return res.status(200).json({meta:{success: "Login successful"}, token, data:{...payload} });
        });
      } catch (err) {
        return res.status(500).json({meta:{ errors: "Server error!" }});
      }
    });
    
  },
);

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required!"),
    body("email").isEmail().withMessage("Invalid email address!"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    db.users.findOne({ email}, async (err, user) => {
      if(err){
        return res.status(500).json({ meta: { errors: "Database error!" } });
      }
      
      if (user) {
        return res
          .status(400)
          .json({meta:{ errors: "Email has already been registered!" }});
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      db.users.insertOne(
        { name, email, hashedPassword, role: "user" },
        (err, data) => {
          if (err) {
            return res
              .status(500)
              .json({ meta: { errors: "Registration failed!" } });
          }
  
          const _id = data._id;
  
          res.append("Location", `/users/${_id}`);
          // res.location(`/api/v1//users/${_id}`);
  
          return res
            .status(201)
            .json({ meta: { success: "User registered successfully." }, data });
        },
      );
      
    });
    

  },
);

module.exports = router;
