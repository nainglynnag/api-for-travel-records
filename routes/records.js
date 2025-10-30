const express = require("express");
const router = express.Router();

const { body, param, validationResult } = require("express-validator");

const mongojs = require("mongojs");
const db = mongojs(process.env.MONGO_URL, ["records"]);

// GET method
router.get("/", (req, res) => {
  // For filters and pagination
  const options = req.query;

  // Validate options, send 400 on error

  const sort = options.sort || {};
  const filter = options.filter || {};
  const limit = parseInt(options.limit) || 10;
  const page = parseInt(options.page) || 1;
  const skip = (page - 1) * limit;

  for (i in sort) {
    sort[i] = parseInt(sort[i]);
  }

  // console.log("options : ", options);
  // console.log("sort : ", sort);
  // console.log("filter : ", filter);

  db.records
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit, (err, data) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.status(200).json({
          meta: { skip, limit, sort, filter, page, total: data.length },
          data,
          links: {
            self: req.originalUrl,
          },
        });
      }
    });
});

// POST method

// Check https://github.com/validatorjs/validator.js#validators for more validators

router.post(
  "/",
  [
    body("name").not().isEmpty(),
    body("nrc").not().isEmpty(),
    body("from").not().isEmpty(),
    body("to").not().isEmpty(),
    body("with").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.body);
    // return res.status(201).json(req.body);

    db.records.insert(req.body, function (err, data) {
      if (err) {
        return res.status(500);
      }

      const _id = data._id;

      res.append("Location", "/api/v1/" + _id);
      return res.status(201).json({ meta: { _id }, data });
    });
  },
);

// PUT method
router.put(
  "/:id",
  [
    param("id").isMongoId(),

    // req body validations
    body("name").notEmpty().trim().escape().withMessage("name is required"),
    body("nrc").notEmpty().trim().escape().withMessage("nrc is required"),
    body("from").notEmpty().trim().escape().withMessage("from is required"),
    body("to").notEmpty().trim().escape().withMessage("to is required"),
    body("with").notEmpty().trim().escape().withMessage("with is required"),
  ],
  (req, res) => {
    const _id = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    db.records.count({ _id: mongojs.ObjectId(_id) }, function (err, count) {
      if (count) {
        const record = {
          _id: mongojs.ObjectId(_id),
          ...req.body,
        };

        db.records.save(record, function (err, data) {
          return res.status(200).json({
            meta: { _id },
            data,
          });
        });
      } else {
        db.records.save(req.body, function (err, data) {
          return res.status(201).json({
            meta: { _id: data._id },
            data,
          });
        });
      }
    });
  },
);

// PATCH method
router.patch("/:id", [param("id").isMongoId()], (req, res) => {
  const _id = req.params.id;

  db.records.count({ _id: mongojs.ObjectId(_id) }, function (err, count) {
    if (count) {
      db.records.updateOne(
        { _id: mongojs.ObjectId(_id) },
        { $set: req.body },
        function (err, data) {
          db.records.findOne(
            { _id: mongojs.ObjectId(_id) },
            function (err, data) {
              return res.status(200).json({
                meta: { _id },
                data,
              });
            },
          );
        },
      );
    } else {
      return res.sendStatus(404);
    }
  });
});

// DELETE method
router.delete(
  "/:id",[param("id").isMongoId()],
  (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
    }
    
    const _id = req.params.id;

    db.records.count({
      _id: mongojs.ObjectId(_id),
    }, function(err, count) {
      if (count) {
        db.records.remove(
          {
            _id: mongojs.ObjectId(_id),
          },
          function (err, data) {
            return res.sendStatus(204);
          }
        );
      } else {
        return res.sendStatus(404);
      }
    });
  }
  
);

module.exports = router;
