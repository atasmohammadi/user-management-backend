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

router.put("/", checkTokenAdmin, async ({ body, user }, res) => {
  const { id, permissions } = body;

  try {
    if (!permissions) {
      return res.sendStatus(400).send({ message: "all fields are required" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.sendStatus(404).send({ message: "User not found" });
    }

    const { id: _, ...rest } = foundAdmin.toJSON();
    await user.replaceOne({
      ...rest,
      permissions: permissions || rest.permissions,
    });

    return res.sendStatus(200).send({ message: "User updated" });
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});

module.exports = router;
