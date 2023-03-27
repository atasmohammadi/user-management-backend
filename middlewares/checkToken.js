const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.PRIVATE_KEY, async (err, email) => {
      if (err) {
        res.status(403);
      } else {
        try {
          const user = await User.findOne({ email }).exec();
          req.user = user;
          req.isAdmin = false;
          next();
        } catch (e) {
          res
            .status(403)
            .send({ message: "Unauthorized / Missing permission" });
        }
      }
    });
  } else {
    res.status(403);
  }
};

const checkAdminToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.PRIVATE_KEY, async (err, email) => {
      if (err) {
        res.status(403).send({ message: "Unauthorized / Missing permission" });
      } else {
        const user = await User.findOne({ email }).exec();
        if (user.permissions.includes("admin")) {
          req.user = user;
          req.isAdmin = true;
          next();
        } else {
          res
            .status(403)
            .send({ message: "Unauthorized / Missing permission" });
        }
      }
    });
  } else {
    res.status(403).send({ message: "Unauthorized / Missing permission" });
  }
};

module.exports = {
  checkToken,
  checkAdminToken,
};
