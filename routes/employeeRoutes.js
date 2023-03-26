const express = require("express");

const Employee = require("../models/Employee");
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

router.post("/create", checkTokenAdmin, async ({ body }, res) => {
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

    res.sendStatus(201).send({ ...createdEmployee.toJSON() });
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});
module.exports = router;
