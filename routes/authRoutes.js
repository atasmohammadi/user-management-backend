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
    if (!email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).exec();

    if (user) {
      return res.status(409).send({ message: "User already exists" });
    }

    const newUserData = {
      email,
      permissions: [],
    };

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    newUserData.password = hash;
    const token = generateToken(email);

    const newUser = new User(newUserData);
    const createdUser = await newUser.save();

    res.status(201).send({ ...createdUser.toJSON(), token });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.post("/login", async ({ body }, res) => {
  const { email, password } = body;

  try {
    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!correctPassword) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = generateToken(email);

    return res.status(200).send({ ...existingUser.toJSON(), token });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

module.exports = router;
