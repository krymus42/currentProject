const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  modelki: [
    {
      modelka: mongoose.Types.ObjectId,
      do: Date,
      zasieg: String
    }
  ],
  ogloszenia: [
    {
      ogloszenie: mongoose.Types.ObjectId,
      do: Date,
      zasieg: String
    }
  ]
});

module.exports = mongoose.model("wyroznieni", Schema, "wyroznieni");
