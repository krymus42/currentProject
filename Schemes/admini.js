const mongoose= require("mongoose");


const Schema = mongoose.Schema({
id:String,
uzytkownik:mongoose.Types.ObjectId,
nazwa_uzytkownika:String,
email:String,
password:String,
});



module.exports = mongoose.model("admini",Schema,"admini");