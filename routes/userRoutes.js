const express = require("express");

const User = require("../models/User");
const { checkAdminToken } = require("../middlewares/checkToken");

const router = express.Router();

router.get("/", checkAdminToken, (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  });
});

router.get("/:id", checkAdminToken, (req, res) => {
  const id = req.params.id;
  User.findById(id).then((user) => {
    res.status(200).send(user);
  });
});

router.delete("/:id", checkAdminToken, (req, res) => {
  const id = req.params.id;
  User.findById(id).then(async (user) => {
    await user.deleteOne();

    return res.status(200).send({ message: "User deleted" });
  });
});

router.put("/", checkAdminToken, async (req, res) => {
  const { id, permissions } = req.body;

  try {
    if (!permissions) {
      return res.status(400).send({ message: "all fields are required" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const { id: _, ...rest } = user.toJSON();
    await user.replaceOne({
      ...rest,
      permissions: permissions || rest.permissions,
    });
    return res.status(200).send({ message: "User updated" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

module.exports = router;
