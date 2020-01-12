const mongoose = require("mongoose");

const Schema = mongoose.Schema(
{
id:Number,
nazwa:String,
kraj:String,
});


module.exports = mongoose.model("wojewodztwa",Schema);