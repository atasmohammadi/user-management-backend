const mongoose = require("mongoose");
const transform = require("../utils/transformSchema");

const userSchema = new mongoose.Schema({
  password: String,
  email: String,
  permissions: [],
  token: String,
});

userSchema.options.toJSON = transform;

module.exports = mongoose.model("User", userSchema);
