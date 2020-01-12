const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"bmarc5050@gmail.com",
        pass:"hrvnpyojrafgpazi",
    }
    });

module.exports = function (options,res){

transport.sendMail(options,(err,info)=>{
if(err){
    console.log(err);
    res.render("error.pug",{error:"Ni chuja nie wyśle"});
}
else res.send(info);
});
};