const express = require("express");
const router = express.Router();

const mongojs = require("mongojs");
const db = mongojs(process.env.MONGO_URL, ["records"]);

router.get("/records",(req,res) => {
  db.records.find((err, data) => {
    if (err) {
      return res.sendStatus(500);
    } else {
      return res.status(200).json({
        meta: {total: data.length},
        data
      })
    }
  })
})

module.exports = router;