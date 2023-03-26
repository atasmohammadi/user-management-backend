const mongoose = require("mongoose");
const transform = require("../utils/transformSchema");

const departmentSchema = new mongoose.Schema({
  name: String,
});

departmentSchema.options.toJSON = transform;

module.exports = mongoose.model("Department", departmentSchema);
