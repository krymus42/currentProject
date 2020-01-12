const crypto = require("crypto");
const randomstring = require("randomstring");
class cipher {
  constructor() {
    this.algorithm = "aes-256-ctr";
    this.password = process.env.SECRET;
  }
  encrypt(text) {
    const coder = crypto.createCipher(this.algorithm, this.password);
    const crypted = coder.update(text, "utf-8", "hex");
    return crypted + coder.final("hex");
  }
  decrypt(text) {
    const decoder = crypto.createDecipher(this.algorithm, this.password);
    const decrypted = decoder.update(text, "hex", "utf-8");
    return decrypted + decoder.final("utf-8");
  }
}

module.exports = new cipher();
