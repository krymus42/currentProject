const mongoose = require("mongoose");

const Schema = mongoose.Schema({
id : String,
email : String,
haslo : String,
typ_konta: String,
konto_potwierdzone: Boolean,
punkty: Number,
});

module.exports = mongoose.model("uzytkownicy",Schema,"uzytkownicy");
