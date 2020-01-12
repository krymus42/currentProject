const express = require("express");
const router = express.Router();
const validator = require("express-validator");
const anonsValidator = require("../validators/anonsValidator");
const anonse = require("../Schemes/anonse");
const parser = require("../utils/formObjectParser");
const uzytkownicy = require("../Schemes/uzytkownicy");
const modelki = require("../Schemes/modelki");
const uslugi = require("../Schemes/uslugi");
const hash = require("../utils/hash");
const cipher = require("../utils/cipher");
const miasta = require("../Schemes/miasta");
const fetch = require("node-fetch");
const mongoose = require("mongoose");

router.get("/:identifier/:model?", async (req, res) => {
  const lista = await uslugi.find();
  const values =
    req.params.identifier != "nowy"
      ? await anonse.findOne({
          _id: cipher.decrypt(req.params.identifier.toString())
        })
      : {};

  const identifier =
    req.params.model != null
      ? `/${req.params.identifier}/${req.params.model}`
      : `/${req.params.identifier}`;

  if (values == null)
    res.render("anonse_empty.pug", {
      uslugi: lista,
      identifier: identifier
    });
  else
    res.render("anonse.pug", {
      uslugi: lista,
      values: values,
      identifier: identifier
    });
});

router.get("/:id", (req, res) => {}); // renderowanie ogloszenia

router.post("/:identifier/:model?", anonsValidator, (req, res) => {
  if (!validator.validationResult(req).isEmpty()) {
    res.render("error.pug", { error: "Błędnie wypełniony formularz!" });
    return;
  }

  if (
    req.session.user == null ||
    (req.session.account_type != "modelka" &&
      req.session.account_type != "klub")
  ) {
    res.render("error.pug", { error: "Nie masz uprawnień do tej czynności" });
    return;
  } else {
    (async () => {
      const dni = [
        "poniedzialek",
        "wtorek",
        "sroda",
        "czwartek",
        "piatek",
        "sobota",
        "niedziela",
        "swieta"
      ];

      let dniObject = {};
      let id;
      if (req.session.account_type == "modelka") {
        const user = await uzytkownicy.findOne({
          email: req.session.user,
          typ_konta: req.session.account_type
        });

        if (user == null) {
          res.render("error.pug", {
            error:
              "Błąd podczas wykonywania działania. Spróbuj ponownie później"
          });

          return;
        } else id = user._id;
      } else if (req.params.model.length != 0)
        id = cipher.decrypt(req.params.model);
      else {
        res.render("Error on server side, try again later");
        return;
      }

      const modelka = await modelki.findOne({ uzytkownik: id });

      dni.forEach(dzien => {
        const tmp = parser(req.body, dzien);
        dniObject[dzien] =
          Object.entries(tmp).length > 0 ? tmp : { od: 0, do: 0 };
        Object.keys(req.body).forEach(entry => {
          if (entry.includes(dzien)) delete req.body[entry];
        });
      });

      const obj = new Object({
        ...req.body,
        modelka: modelka._id,
        godziny_pracy: { ...dniObject },
        data_modyfikacji: new Date()
      });

      if (req.params.identifier == "nowy") {
        anonse.create(obj, async err => {
          if (err)
            res.render("error.pug", {
              error: err
            });
          else {
            const one = await miasta.findOne({
              nazwa: req.body.adres_miasto
            });
            if (one == null) {
              const link = `https://eu1.locationiq.com/v1/search.php?key=${process.env.API_KEY}&q=${req.body.adres_miasto},${req.body.adres_wojewodztwo}&format=json`;
              const response = await fetch(link);
              const json = await response.json();

              miasta.create({
                nazwa: req.body.adres_miasto,
                lat: json[0].lat,
                lon: json[0].lon,
                premium: 0
              });
            }
            res.redirect("/");
          }
        });
      } else {
        const anons = await anonse.findOne({
          _id: cipher.decrypt(req.params.identifier),
          modelka: modelka._id
        });

        delete obj._id;

        if (anons == null) {
          res.render("error.pug", { error: "Error, try again later" });
          return;
        }

        Object.keys(obj).forEach(key => {
          anons[key] = obj[key];
        });

        anons.save();
        res.redirect("/");
      }
    })();
  }
});

module.exports = router;
