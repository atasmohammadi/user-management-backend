const express = require("express");

const Log = require("../models/Log");
const { checkTokenAdmin } = require("../middleware/checkToken");

const router = express.Router();

router.get("/", checkTokenAdmin, (req, res) => {
  Log.find({})
    .populate(["department", "user", "employee"])
    .then((logs) => {
      res.sendStatus(200).send(logs);
    });
});

router.get("/:id", checkTokenAdmin, (req, res) => {
  const id = req.params.id;
  Log.findById(id)
    .populate(["department", "user", "employee"])
    .then((log) => {
      res.sendStatus(200).send(log);
    });
});

module.exports = router;
