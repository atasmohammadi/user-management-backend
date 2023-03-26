const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        User.findOne({ username: data }).exec((err, user) => {
          req.user = user;
          req.isAdmin = false;
          next();
        });
      }
    });
  } else {
    res.sendStatus(403);
  }
};

const checkAdminToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
      if (err) {
        res
          .sendStatus(403)
          .send({ message: "Unauthorized / Missing permission" });
      } else {
        User.findOne({ username: data }).exec((err, user) => {
          if (user.permissions.includes("admin")) {
            req.user = user;
            req.isAdmin = true;
            next();
          } else {
            res
              .sendStatus(403)
              .send({ message: "Unauthorized / Missing permission" });
          }
        });
      }
    });
  } else {
    res.sendStatus(403).send({ message: "Unauthorized / Missing permission" });
  }
};

module.exports = {
  checkToken,
  checkAdminToken,
};
