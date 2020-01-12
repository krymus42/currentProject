const express = require("express");
const router = express.Router();
const miasta = require("../Schemes/miasta");
const path = require("path");

router.post("/dodaj", (req, res) => {
  const nazwa = req.body.nazwa;
  const nazwa_wojewodztwa = req.body.nazwa_wojewodztwa;
  if (nazwa == null || nazwa_wojewodztwa == null)
    res.render("error.pug", { error: "Niekompletny formularz" });
  if (
    miasta.findOne({
      miasto: nazwa,
      wojewodztwo: { nazwa: nazwa_wojewodztwa }
    }) != null
  )
    res.render("error.pug", {
      error: "Takie miasto już znaduje się w bazie danych!"
    });

  miasta.create({
    miasto: nazwa,
    wojewodztwa: { nazwa: nazwa_wojewodztwa },
    premium: 0
  });
});

router.get("/usun/:id", (req, res) => {
  miasta.remove({ id: req.params.id });
  res.redirect("/");
});

module.exports = router;
