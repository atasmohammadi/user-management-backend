const express = require("express");

const Log = require("../models/Log");
const { checkAdminToken } = require("../middlewares/checkToken");

const router = express.Router();

router.get("/", checkAdminToken, (req, res) => {
  Log.find({})
    .populate("user", "email")
    .populate(["department", "employee"])
    .then((logs) => {
      res.status(200).send(logs);
    });
});

router.get("/:id", checkAdminToken, (req, res) => {
  const id = req.params.id;
  Log.findById(id)
    .populate("user", "email")
    .populate(["department", "employee"])
    .then((log) => {
      res.status(200).send(log);
    });
});

module.exports = router;
