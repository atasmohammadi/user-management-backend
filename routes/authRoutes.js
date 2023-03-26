const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const generateToken = (data) => {
  return jwt.sign(data, process.env.PRIVATE_KEY);
};

router.post("/register", async ({ body }, res) => {
  const { password, email } = body;

  try {
    if (!email) {
      return res.sendStatus(400).send({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).exec();

    if (user) {
      return res.sendStatus(409).send({ message: "User already exists" });
    }

    const newUserData = {
      email,
      permissions: [],
    };

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    newUserData.password = hash;
    newUserData.token = generateToken(username);

    const newUser = new User(newUserData);
    const createdUser = await newUser.save();

    res.sendStatus(201).send({ ...createdUser.toJSON() });
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});

router.post("/login", async ({ body }, res) => {
  const { email, password } = body;

  try {
    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      return res.sendStatus(401).send({ message: "Invalid credentials" });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!correctPassword) {
      return res.sendStatus(401).send({ message: "Invalid credentials" });
    }

    return res.sendStatus(200).send({ ...existingUser.toJSON() });
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});

module.exports = router;
