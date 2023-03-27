const mongoose = require("mongoose");
const transform = require("../utils/transformSchema");
const Department = require("./Department");
const Employee = require("./Employee");
const User = require("./User");

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

logSchema.path("department").validate(async (departmentId) => {
  try {
    const department = await Department.findById(departmentId);
    if (!department) return false;
    return true;
  } catch (e) {
    return false;
  }
});

logSchema.path("employee").validate(async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return false;
    return true;
  } catch (e) {
    return false;
  }
});

logSchema.path("user").validate(async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;
    return true;
  } catch (e) {
    return false;
  }
});

module.exports = mongoose.model("Log", logSchema);
