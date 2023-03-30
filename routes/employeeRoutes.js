const express = require("express");

const Employee = require("../models/Employee");
const Log = require("../models/Log");
const { checkToken, checkAdminToken } = require("../middlewares/checkToken");

const router = express.Router();

router.get("/", checkToken, (req, res) => {
  Employee.find({})
    .populate("department")
    .then((employees) => {
      res.status(200).send(employees);
    });
});

router.get("/:id", checkToken, (req, res) => {
  const id = req.params.id;
  Employee.findById(id)
    .populate("department")
    .then((employee) => {
      res.status(200).send(employee);
    });
});

router.post("/", checkAdminToken, async ({ body, user }, res) => {
  const { firstName, lastName, address, jobTitle, department } = body;

  try {
    if (!firstName || !lastName || !address || !jobTitle || !department) {
      return res.status(400).send({ message: "all fields are required" });
    }

    const employee = await Employee.findOne({ firstName, lastName }).exec();

    if (employee) {
      return res.status(409).send({ message: "Employee already exists" });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      address,
      jobTitle,
      department,
    });
    const createdEmployee = await newEmployee.save();
    const createdEmployeeJSON = createdEmployee.toJSON();

    const newLog = new Log({
      time: Date.now(),
      user: user.id,
      employee: createdEmployeeJSON.id,
      action: "Create Employee",
      department,
    });
    await newLog.save();

    res.status(201).send(createdEmployeeJSON);
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.put("/", checkAdminToken, async ({ body, user }, res) => {
  const { id, firstName, lastName, address, jobTitle, department } = body;

  try {
    if (!firstName || !lastName || !address || !jobTitle || !department) {
      return res.status(400).send({ message: "all fields are required" });
    }

    const employee = await Employee.findById(id).exec();

    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }

    const { id: _, ...rest } = employee.toJSON();
    await employee.replaceOne({
      ...rest,
      firstName: firstName || rest.firstName,
      lastName: lastName || rest.lastName,
      address: address || rest.address,
      jobTitle: jobTitle || rest.jobTitle,
      department: department || rest.department,
    });

    const newLog = new Log({
      time: Date.now(),
      user: user.id,
      employee: id,
      action: `Modify Employee`,
      department,
    });
    await newLog.save();

    return res.status(200).send({ message: "Employee updated" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.delete("/:id", checkAdminToken, (req, res) => {
  const id = req.params.id;
  Employee.findById(id).then(async (employee) => {
    const newLog = new Log({
      time: Date.now(),
      user: req.user.id,
      employee: id,
      action: `Delete Employee`,
      department: employee.department,
    });

    await employee.deleteOne();
    await newLog.save();

    return res.status(200).send({ message: "Employee deleted" });
  });
});

module.exports = router;
