const express = require("express");

const Department = require("../models/Department");
const { checkAdminToken, checkToken } = require("../middlewares/checkToken");

const router = express.Router();

router.get("/", checkToken, (req, res) => {
  Department.find({}).then((departments) => {
    res.status(200).send(departments);
  });
});

router.get("/:id", checkToken, (req, res) => {
  const id = req.params.id;
  Department.findById(id).then((department) => {
    res.status(200).send(department);
  });
});

router.post("/", checkAdminToken, async ({ body, user }, res) => {
  const { name } = body;

  try {
    if (!name) {
      return res.status(400).send({ message: "all fields are required" });
    }

    const department = await Department.findOne({ name }).exec();

    if (department) {
      return res.status(409).send({ message: "Department already exists" });
    }

    const newDepartment = new Department({
      name,
    });
    const createdDepartment = await newDepartment.save();
    const createdDepartmentJSON = createdDepartment.toJSON();

    res.status(201).send(createdDepartmentJSON);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

router.post("/batch", checkAdminToken, async ({ body, user }, res) => {
  const { departments } = body;
  try {
    if (!departments) {
      return res.status(400).send({ message: "all fields are required" });
    }
    const docs = await Department.insertMany(departments);
    return res.status(201).send(docs.map((d) => d.toJSON()));
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.delete("/:id", checkAdminToken, (req, res) => {
  const id = req.params.id;
  Department.findById(id).then(async (department) => {
    await department.deleteOne();

    return res.status(200).send({ message: "Department deleted" });
  });
});

router.put("/", checkAdminToken, async (req, res) => {
  const { id, name } = req.body;

  try {
    if (!name) {
      return res.status(400).send({ message: "all fields are required" });
    }

    const department = await Department.findById(id).exec();

    if (!department) {
      return res.status(404).send({ message: "Department not found" });
    }

    const { id: _, ...rest } = department.toJSON();
    await department.replaceOne({
      ...rest,
      name: name || rest.name,
    });

    return res.status(200).send({ message: "Department updated" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});
module.exports = router;
