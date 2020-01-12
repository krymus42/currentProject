const express = require("express");
const router = express.Router();
const uzytkownicy = require("../Schemes/uzytkownicy");
const panel_modelki = require("./panel/panel_modelki");
const panel_klubu = require("./panel/panel_klubu");
const anonse = require("../Schemes/anonse");
const modelki = require("../Schemes/modelki");
const cipher = require("../utils/cipher");
const uslugi = require("../Schemes/uslugi");

router.get("/:identifier?", async (req, res) => {
  if (req.session.user == null) {
    res.render("error.pug", { error: "Nie jesteś zalgowany" });
    return;
  }

  if (req.session.account_type == "admin") {
    res.redirect("/adminPanel");
    return;
  }
  const uzytkownik = await uzytkownicy.findOne({
    email: req.session.user,
    typ_konta: req.session.account_type
  });

  const modelkiLista = await modelki.find({ uzytkownik: uzytkownik._id });
  const condition = [];
  modelkiLista.forEach(entry => {
    entry.identifier = cipher.encrypt(entry._id.toString());
    condition.push(entry._id);
  });

  const anons =
    condition.length > 0
      ? await anonse.find({ modelka: { $in: condition } })
      : {};

  if (anons.length > 0)
    anons.forEach(one => {
      one.identifier = cipher.encrypt(one._id.toString());
    });

  res.render("panel_uzytkownika.pug", {
    language: req.session.language.logowanie,
    anonse: anons,
    modelki: modelkiLista,
    typ: req.session.account_type
  });
});

module.exports = router;
