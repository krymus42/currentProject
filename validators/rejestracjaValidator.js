const { check } = require("express-validator");

module.exports = [
  check("email")
    .notEmpty()
    .isEmail(),
  check("haslo").notEmpty(),
  check("haslo_powtorzenie").notEmpty()
];
