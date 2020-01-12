const mongoose = require("mongoose");
const { MongooseAutoIncrementID } = require("mongoose-auto-increment-reworked");
const Schema = mongoose.Schema({
  nazwa: String,
  index: {
    girls: String,
    clubs: String,
    work: String,
    contact: String
  },
  anonse: {
    title: String,
    personal_data: String,
    link: String,
    model_title: String,
    content: String,
    date: String,
    phone: String,
    second_phone: String,
    website: String,
    own_place: String,
    price_60: String,
    price_90: String,
    price_night: String,
    trips: String,
    trip_cost: String,
    hours: String,
    day_1: String,
    day_2: String,
    day_3: String,
    day_4: String,
    day_5: String,
    day_6: String,
    day_7: String,
    holidays: String,
    from: String,
    to: String,
    day_off: String,
    all_day: String,
    city: String,
    region: String,
    save: String,
    languages: String,
    polish: String,
    english: String,
    german: String,
    french: String,
    spanish: String,
    russian: String,
    other: String
  },
  logowanie: {
    title: String,
    input_mail: String,
    input_password: String,
    forgot_password: String,
    register: String,
    button: String
  },
  ogloszenia: {
    title: String,
    phone: String,
    second_phone: String,
    email: String
  }
});

Schema.plugin(MongooseAutoIncrementID.plugin, { modelName: "jezyki" });
module.exports = mongoose.model("jezyki", Schema, "jezyki");
