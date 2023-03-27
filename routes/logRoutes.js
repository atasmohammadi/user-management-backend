const express = require("express");

const Log = require("../models/Log");
const { checkTokenAdmin } = require("../middleware/checkToken");

const router = express.Router();

router.get("/", checkTokenAdmin, (req, res) => {
  Log.find({}).then((logs) => {
    res.sendStatus(200).send(logs);
  });
});

router.get("/:id", checkTokenAdmin, (req, res) => {
  const id = req.params.id;
  Log.findById(id).then((log) => {
    res.sendStatus(200).send(log);
  });
});

module.exports = router;
