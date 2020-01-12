const mongoose = require("mongoose");
const { MongooseAutoIncrementID } = require("mongoose-auto-increment-reworked");
const Schema = mongoose.Schema({
  id: Number,
  nazwa_pl: String,
  nazwa_eng: String,
  nazwa_de: String
});

Schema.plugin(MongooseAutoIncrementID.plugin, { modelName: "uslugi" });
module.exports = mongoose.model("uslugi", Schema, "uslugi");
