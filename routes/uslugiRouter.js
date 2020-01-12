const express = require("express");
const router = express.Router();
const uslugi = require("../Schemes/uslugi");

router.post("/", async (req, res) => {
  const usluga = await uslugi.findOne({ nazwa: req.body.nazwa });
  if (usluga != null)
    res.render("error.pug", { error: "Taka usluga juz istnieje" });
  else {
    uslugi.create({
      nazwa_pl: req.body.nazwa_pl,
      nazwa_eng: req.body.nazwa_eng,
      nazwa_de: req.body.nazwa_de
    });
  }
});
