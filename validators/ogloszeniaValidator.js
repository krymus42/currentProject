const { check } = require("express-validator");

module.exports = [
  check("email").isEmail(),
  check("telefon").isString(),
  check("telefon_2").isString(),
  check("tytul")
    .notEmpty()
    .isString(),
  check("tresc")
    .notEmpty()
    .isString()
];
