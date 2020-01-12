const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  wyroznione: Boolean,
  tytul: String,
  tresc: String,
  telefon: String,
  email: String,
  adres: String,
  pokaz_adres: Boolean,
  video: String
});

module.exports = mongoose.model("ogloszenia", Schema, "ogloszenia");
