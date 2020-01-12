const mongoose = require("mongoose");
const { MongooseAutoIncrementID } = require("mongoose-auto-increment-reworked");

const Schema = mongoose.Schema({
  nazwa: String,
  lat: String,
  lon: String,
  wojewodztwo: String,
  premium: Number
});

Schema.plugin(MongooseAutoIncrementID.plugin, { modelName: "miasta" });
module.exports = mongoose.model("miasta", Schema, "miasta");
