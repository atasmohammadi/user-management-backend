const express = require("express");

const Employee = require("../models/Employee");
const Log = require("../models/Log");
const { checkToken, checkTokenAdmin } = require("../middleware/checkToken");

const router = express.Router();

router.get("/", checkToken, (req, res) => {
  Employee.find({}).then((employees) => {
    res.sendStatus(200).send(employees);
  });
});

router.get("/:id", checkToken, (req, res) => {
  const id = req.params.id;
  Employee.findById(id).then((employee) => {
    res.sendStatus(200).send(employee);
  });
});

router.post("/", checkTokenAdmin, async ({ body, user }, res) => {
  const { firstName, lastName, address, jobTitle, department } = body;

  try {
    if (!firstName || !lastName || !address || !jobTitle || !department) {
      return res.sendStatus(400).send({ message: "all fields are required" });
    }

    const employee = await Employee.findOne({ firstName, lastName }).exec();

    if (employee) {
      return res.sendStatus(409).send({ message: "Employee already exists" });
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

    res.sendStatus(201).send(createdEmployeeJSON);
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});

router.put("/", checkTokenAdmin, async ({ body, user }, res) => {
  const { id, firstName, lastName, address, jobTitle, department } = body;

  try {
    if (!firstName || !lastName || !address || !jobTitle || !department) {
      return res.sendStatus(400).send({ message: "all fields are required" });
    }

    const employee = await Employee.findById(id).exec();

    if (!employee) {
      return res.sendStatus(404).send({ message: "Employee not found" });
    }

    const { id: _, ...rest } = foundAdmin.toJSON();
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

    return res.sendStatus(200).send({ message: "Employee updated" });
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});
module.exports = router;
