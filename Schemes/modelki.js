const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  imie: String,
  uzytkownik: mongoose.Types.ObjectId,
  wiek: Number,
  wzrost: Number,
  kolor_oczu: String,
  kolor_wlosow: String,
  dlugosc_wlosow: String,
  orientacja: String,
  owlosienie_lonowe: String,
  waga: Number,
  biust: Number,
  inny: String,
  jezyki: [String],
  zdjecia: [String],
  plik_weryfikacyjny: String
});

module.exports = mongoose.model("modelki", Schema, "modelki");
