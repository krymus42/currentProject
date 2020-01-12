const { check } = require("express-validator");

module.exports = [
  check("tytul").notEmpty(),
  check("tresc").notEmpty(),
  check("telefon").notEmpty(),
  check("telefon_2").optional(),
  check("adres_wojewodztwo")
    .isString()
    .notEmpty(),
  check("adres_miasto")
    .notEmpty()
    .isString(),
  check("wlasny_lokal").notEmpty(),
  check("wyjazdy")
    .notEmpty()
    .isString()
];
