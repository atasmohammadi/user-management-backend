const mongoose = require("mongoose");
const transform = require("../utils/transformSchema");

const logSchema = new mongoose.Schema({
  time: mongoose.Schema.Types.Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: String,
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

logSchema.options.toJSON = transform;

module.exports = mongoose.model("Log", logSchema);
