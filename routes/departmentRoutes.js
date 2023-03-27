const express = require("express");

const Department = require("../models/Department");
const { checkTokenAdmin } = require("../middleware/checkToken");

const router = express.Router();

router.get("/", checkTokenAdmin, (req, res) => {
  Department.find({}).then((departments) => {
    res.sendStatus(200).send(departments);
  });
});

router.get("/:id", checkTokenAdmin, (req, res) => {
  const id = req.params.id;
  Department.findById(id).then((department) => {
    res.sendStatus(200).send(department);
  });
});

router.post("/", checkTokenAdmin, async ({ body, user }, res) => {
  const { name } = body;

  try {
    if (!name) {
      return res.sendStatus(400).send({ message: "all fields are required" });
    }

    const department = await Department.findOne({ name }).exec();

    if (department) {
      return res.sendStatus(409).send({ message: "Department already exists" });
    }

    const newDepartment = new Department({
      name,
    });
    const createdDepartment = await newDepartment.save();
    const createdDepartmentJSON = createdDepartment.toJSON();

    res.sendStatus(201).send(createdDepartmentJSON);
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});

router.put("/", checkTokenAdmin, async ({ body, user }, res) => {
  const { id, name } = body;

  try {
    if (!name) {
      return res.sendStatus(400).send({ message: "all fields are required" });
    }

    const department = await Department.findById(id).exec();

    if (!department) {
      return res.sendStatus(404).send({ message: "Department not found" });
    }

    const { id: _, ...rest } = foundAdmin.toJSON();
    await department.replaceOne({
      ...rest,
      name: name || rest.name,
    });

    return res.sendStatus(200).send({ message: "Department updated" });
  } catch (err) {
    res.sendStatus(500).send({ message: err });
  }
});
module.exports = router;
