const mongoose = require("mongoose");


const Schema = mongoose.Schema({
id:Number,
nazwa:String,
});


module.exports = mongoose.model("jezyki",Schema);