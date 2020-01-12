const express = require("express");
const router = express.Router();
const modelkaValidator = require("../validators/modelkaValidator");
const validator = require("express-validator");
const uzytkownicy = require("../Schemes/uzytkownicy");
const modelki = require("../Schemes/modelki");
const upload = require("../utils/upload");
const anonse = require("../Schemes/anonse");
const cipher = require("../utils/cipher");
router.get("/nowa/:identifier?", async (req, res) => {
  if (
    req.session.account_type != "modelka" &&
    req.session.account_type != "klub"
  ) {
    res.render("error.pug", {
      error: "You don't have permission to watch this"
    });
    return;
  }

  const user = await uzytkownicy.findOne({
    email: req.session.user,
    typ_konta: req.session.account_type
  });

  if (user == null) {
    res.render("error.pug", {
      error: "Couldn't find user with specified username"
    });
    return;
  }

  const data =
    req.account_type == "modelka"
      ? await modelki.findOne({ uzytkownik: user._id })
      : req.params.identifier != null
      ? await modelki.findOne({
          _id: cipher.decrypt(req.params.identifier.toString())
        })
      : {};

  let anons = await anonse.find({ modelka: data._id });
  anons.forEach(one => {
    one.identifier = cipher.encrypt(one._id.toString());
    console.log(`${one._id} before decription ${one.identifier}`);
  });

  res.render("panel_modelka.pug", {
    language: req.session.language.panel_modelki,
    values: data,
    anonse: anons
  });
});

router.post(
  "/:identifier?",
  modelkaValidator,
  upload.array("pliki", process.env.IMAGES_COUNT),
  (req, res) => {
    if (!validator.validationResult(req.body).isEmpty()) {
      res.render("error.pug", { error: "Niepoprawne bądź niepełne dane" });
      return;
    }
    console.log(req.body);
    if (
      req.session.account_type == null ||
      req.session.user == null ||
      (req.session.account_type != "modelka" &&
        req.session.account_type != "klub")
    ) {
      res.render("error.pug", { error: "Nie masz uprawnień do przeglądania" });
      return;
    }
    console.log(req.body);
    (async () => {
      const user = await uzytkownicy.findOne({
        email: req.session.user,
        typ_konta: req.session.account_type
      });
      let modelka =
        req.session.account_type == "modelka"
          ? await modelki.findOne({ uzytkownik: user._id })
          : req.session.account_type == "klub" && req.session.identifier != null
          ? await modelki.findOne({
              _id: cipher.decrypt(req.params.identifier)
            })
          : null;
      if (user == null) {
        res.render("error.pug", {
          error: "Nie znaleziono użytkownika. Spróbuj ponownie później"
        });
        return;
      }
      if (modelka == null) {
        modelki.create({ uzytkownik: user._id, ...req.body }, err => {
          if (err)
            res.render("error.pug", {
              error: "Problem podczas zapisywania. Spróbuj ponownie później"
            });
          else res.redirect("/");
        });
      } else {
        modelki.updateOne(modelka, { $set: { ...req.body } }, err => {
          if (err)
            res.render("error.pug", {
              error: "Problem podczas zapisywania. Spróbuj ponownie później"
            });
          else res.redirect("/");
        });
      }
    })();
  }
);

router.get("/", async (req, res) => {
  const logged = req.session.user != null;
  const lista = await modelki.find();
  const listaAnonse = await anonse.find();
  let objects = [];

  listaAnonse.forEach(anons => {
    lista.forEach(modelka => {
      console.log({
        identifier: cipher.encrypt(anons._id.toString()),
        imie: modelka.imie,
        miasto: anons.adres_miasto
      });
      if (modelka._id == anons.modelka) {
        objects.push({
          identifier: cipher.encrypt(anons._id.toString()),
          imie: modelka.imie,
          miasto: anons.adres_miasto
        });
        return;
      }
    });
  });

  res.render("index.pug", {
    language: req.session.language.index,
    modelki: objects
  });
});

router.get("/:identifier", async (req, res) => {
  const id = cipher.decrypt(req.params.identifier.toString());

  const anons = await anonse.findOne({ _id: id });

  if (anons == null) {
    res.render("error.pug", { error: "Anons not found" });
    return;
  }

  console.log(anons);

  const modelka = await modelki.findOne({ _id: anons.modelka });

  if (anons == null) {
    res.render("error.pug", { error: "Anons not found" });
    return;
  }

  res.render("anons.pug", { anons: anons, modelka: modelka });
});

module.exports = router;
