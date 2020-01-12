const crypto = require("crypto");


module.exports = (sentence)=>{
return crypto.createHash("sha256").update(sentence).digest("hex");
}