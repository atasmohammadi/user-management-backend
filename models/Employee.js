const mongoose = require("mongoose");
const transform = require("../utils/transformSchema");
const Department = require("./Department");

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

userSchema.path("department").validate(async (departmentId) => {
  try {
    const department = await Department.findById(departmentId);
    if (!department) return false;
    return true;
  } catch (e) {
    return false;
  }
});

module.exports = mongoose.model("Employee", userSchema);
