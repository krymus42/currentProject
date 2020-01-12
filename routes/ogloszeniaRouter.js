const express = require("express");
const router = express.Router();
const ogloszenia = require("../Schemes/ogloszenia");
const miasta = require("../Schemes/miasta");
const fetch = require("node-fetch");

router.post("/usun/:id", (req, res) => {
  ogloszenia.remove({ id: req.params.id }, { justOne: true });
  // odeślij do jakiejś seksownej ściezki XD
});

router.get("/", (req, res) => {
  (async () => {
    const lista = await ogloszenia.find();
    res.render("ogloszenia.pug", {
      ogloszenia: lista,
      language: req.session.language.ogloszenia
    });
  })();
});

router.get("/:id", (req, res) => {
  const ogloszenie = ogloszenia.findOne({ id: req.params.id });
  if (ogloszenie != null) res.send(" content"); // taaa zamień to na to co ma tam być
});

router.post("/", (req, res) => {
  const tresc = req.body.tresc;
  const tytul = req.body.tytul;
  const email = req.body.email;
  const telefon = req.body.telefon;
  const miasto = req.body.miasto;
  const wojewodztwo = req.body.wojewodztwo;
  if (
    tresc == null ||
    tytul == null ||
    email == null ||
    telefon == null ||
    miasto == null ||
    wojewodztwo == null
  ) {
    res.render("error.pug", { error: "Niekompletne dane" });
    return;
  }
  const ogloszenie = ogloszenia.create(
    {
      tytul: tytul,
      tresc: tresc,
      email: email,
      telefon: telefon,
      miasto: miasto
    },
    async err => {
      if (err)
        res.render("error.pug", { error: "Błąd podczas dodawania ogłoszenia" });
      else res.redirect("/");
    }
  );
  return;
});

module.exports = router;
