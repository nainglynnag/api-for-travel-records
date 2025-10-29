const express = require("express");
const router = express.Router();

const mongojs = require("mongojs");
const db = mongojs(process.env.MONGO_URL, ["records"]);

router.get("/records",(req,res) => {
  // For filters and pagination
  const options = req.query;
  
  // Validate options, send 400 on error
  
  const sort = options.sort || {};
  const filter = options.filter || {};
  const limit = parseInt(options.limit) || 10;
  const page = parseInt(options.page) || 1;
  const skip = (page - 1) * limit;
  
  for(i in sort){
    sort[i] = parseInt(sort[i]);
  }
  
  // console.log("options : ", options);
  // console.log("sort : ", sort);
  // console.log("filter : ", filter);
  
  db.records.find(filter).sort(sort).skip(skip).limit(limit, (err,data) => {
    if(err){
      return res.sendStatus(500);
    }else{
      return res.status(200).json({
        meta:{skip,limit, sort, filter,page,total:data.length},
        data,
        links:{
          self: req.originalUrl,
        }
      })
    }
  })
})

module.exports = router;