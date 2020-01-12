const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  link: String,
  user: mongoose.Types.ObjectId
});

module.exports = mongoose.model("weryfikacja", Schema, "weryfikacja");
