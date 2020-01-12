const mongoose = require("mongoose");


const Schema = mongoose.Schema(
    {
     id:String,
     nazwa:String,
     email:String,
     telefon:String,
     telefon_2:String,
     miejscowosc:String,
     wojewodztwo:String,
     uslugi_klubow: [
         {
            id:Number,
            nazwa:String,
         }
     ],
     modelki:[{
         type:mongoose.Types.ObjectId,
         ref:"modelki",
     }]
    }
);


module.exports = mongoose.model("kluby",Schema,"kluby");