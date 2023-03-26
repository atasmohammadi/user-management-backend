const mongoose = require("mongoose");
const transform = require("../utils/transformSchema");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  jobTitle: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

userSchema.options.toJSON = transform;

module.exports = mongoose.model("Employee", userSchema);
