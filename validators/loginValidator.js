const { check } = require("express-validator");

module.exports = [
  check("email")
    .isEmail()
    .notEmpty(),
  check("password").notEmpty()
];
