const { check } = require("express-validator");

module.exports = [
  check("imie")
    .isString()
    .notEmpty(),
  check("wiek").notEmpty(),
  check("wzrost"),
  check("kolor_oczu"),
  check("dlugosc_wlosow"),
  check("kolor_wlosow"),
  check("orientacja"),
  check("owlosienie_lonowe"),
  check("waga"),
  check("biust")
];
