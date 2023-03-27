const express = require("express");

const User = require("../models/User");
const { checkTokenAdmin } = require("../middleware/checkToken");

const router = express.Router();

router.get("/", checkTokenAdmin, (req, res) => {
  User.find({}).then((users) => {
    res.sendStatus(200).send(users);
  });
});

router.get("/:id", checkTokenAdmin, (req, res) => {
  const id = req.params.id;
  User.findById(id).then((user) => {
    res.sendStatus(200).send(user);
  });
});

module.exports = router;
