const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  uzytkownik: mongoose.Types.ObjectId,
  link: String
});

module.exports = mongoose.model(
  "przywracanie_hasla",
  Schema,
  "przywracanie_hasla"
);
