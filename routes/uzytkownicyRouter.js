const express = require("express");
const router = express.Router();
const kluby = require("../Schemes/kluby");
const modelki = require("../Schemes/modelki");
const uzytkownicy = require("../Schemes/uzytkownicy");
const admini = require("../Schemes/admini");
const weryfikacja = require("../Schemes/weryfikacja");
const accountTypes = require("../utils/accountTypes");
const mail = require("../utils/mailing");
const hash = require("../utils/hash");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const loginValidator = require("../validators/loginValidator");
const registerValidator = require("../validators/rejestracjaValidator");
const przywracanie = require("../Schemes/przywracanie_hasla");

router.get("/rejestracja/:type", (req, res) => {
  res.render("rejestracja.pug", {
    language: JSON.parse(JSON.stringify(req.session.language.logowanie)),
    type: req.params.type
  });
});

router.post("/rejestracja", registerValidator, (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.send(validationResult(req));
    return;
  } else {
    if (
      req.body.type != "modelka" &&
      req.body.type != "klub" &&
      req.body.type != "uzytkownik"
    ) {
      res.render("error.pug", { error: "Wystąpił błąd, spróbuj później" });
      return;
    }
    (async () => {
      const one = await uzytkownicy
        .findOne({ email: req.body.email })
        .catch(err => console.log(err));
      if (one != null) {
        res.send("Jest taki user");
        return;
      } else {
        if (req.body.haslo === req.body.haslo_powtorzenie) {
          const doc = await uzytkownicy.create({
            email: req.body.email,
            haslo: req.body.haslo,
            typ_konta: req.body.type,
            punkty: 0
          });
          const verify = await weryfikacja.create({
            link: hash(req.body.email),
            user: doc._id
          });
          mail(
            {
              from: process.env.EMAIL,
              to: "krywojciechowski50@gmail.com",
              subject: process.env.SUBJECT,
              html: `<a href=${process.env.DOMENA}/uzytkownicy/weryfikacja/${
                req.body.type
              }/${hash(req.body.email)}>${process.env.DOMENA}/uzytkownicy/${
                req.body.type
              }/${hash(req.body.email)}</a>`
            },
            res
          );
        } else {
          res.render("error.pug", { error: "Hasła nie są takie same" });
          return;
        }
      }
    })();
  }
});

router.get("/weryfikacja/:id", (req, res) => {
  (async () => {
    const id = req.params.id;
    if (id == null) {
      res.render("error.js", {
        error: "Błąd podczas weryfikacji. Spróbuj ponownie później"
      });
      return;
    }
    const obj = await weryfikacja.findOne({ link: id });
    uzytkownicy.findOneAndUpdate(
      { _id: obj.user },
      { $set: { konto_potwierdzone: true } },
      (err, doc) => {
        if (err != null) {
          res.render("error.pug", { error: err });
          return;
        } else {
          console.log(doc);
        }
      }
    );
  })();
});

router.get("/login", (req, res) =>
  res.render("login.pug", {
    language: JSON.parse(JSON.stringify(req.session.language.logowanie))
  })
);
router.get("/login/:error", (req, res) => {
  res.render("login.pug", {
    error: req.params.error,
    language: JSON.parse(JSON.stringify(req.session.language.logowanie))
  });
});
router.post("/login", loginValidator, (req, res) => {
  (async () => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      res.redirect("/uzytkownicy/login/Wypełnij formularz");
      return;
    }
    const condition = { email: req.body.email, haslo: req.body.password };
    let user = await uzytkownicy.findOne(condition);
    if (user != null) {
      req.session.user = req.body.email;
      req.session.account_type = await user.typ_konta;

      res.redirect(`/`);
    } else
      res.render("login.pug", {
        language: req.session.language.logowanie,
        error: "Niepoprawne dane"
      });
  })();
});

router.get("/przywracanie", (req, res) =>
  res.render("przywracanie.pug", {
    language: JSON.parse(JSON.stringify(req.session.language.logowanie))
  })
);
router.post("/przywracanie", (req, res) => {
  if (req.body.email != null) {
    (async () => {
      const user = await uzytkownicy.findOne({ email: req.body.email });
      if (user == null) {
        res.render("przywracanie.pug", {
          language: JSON.parse(JSON.stringify(req.session.language.logowanie)),
          error: "Nie ma takiego użytkownika"
        });
        return;
      }
      const przywrocony = await przywracanie.create(
        {
          uzytkownik: user._id,
          link: hash(req.body.email)
        },
        err => {
          if (err != null)
            res.render("error.pug", {
              error: "Wystąpił błąd, spróbój ponownie później"
            });
          else {
            mail(
              {
                from: process.env.EMAIL,
                to: "krywojciechowski50@gmail.com",
                subject: process.env.SUBJECT,
                html: `<a href=${
                  process.env.DOMENA
                }/uzytkownicy/przywracanie/${hash(req.body.email)}>${
                  process.env.DOMENA
                }/uzytkownicy/przywracanie/${hash(req.body.email)}</a>`
              },
              res
            );
          }
          res.render("error.pug", {
            error: "Na twój adres email wysłaliśmy link do przywracania hasła"
          });
          return;
        }
      );
    })();
  } else
    res.render("przywracanie.pug", {
      language: JSON.parse(JSON.stringify(req.session.language.logowanie)),
      error: "Nie wpisałeś email"
    });
});

router.get("/przywracanie/:id", async (req, res) => {
  const przywroc = await przywracanie.findOne({ link: req.params.id });
  if (przywroc == null) {
    res.render({ error: "Nie znaleziono takiego id zapytania" });
    return;
  } else {
    res.render("changePassword.pug", {
      id: req.params.id,
      language: JSON.parse(JSON.stringify(req.session.language.logowanie))
    });
  }
});
router.post("/przywracanie/:id", (req, res) => {
  (async () => {
    const przywroc = await przywracanie.findOne({ link: req.params.id });
    if (przywroc == null) {
      res.render("error.pug", {
        error: "Wystąpił błąd. Spróbuj ponownie później"
      });
      return;
    }
    uzytkownicy.findOneAndUpdate(
      { _id: przywroc.uzytkownik },
      { $set: { haslo: req.body.haslo } },
      err => {
        if (err) {
          res.render("error.pug", {
            error: "Wystąpił błąd. Spróbuj ponownie później"
          });
          return;
        } else
          przywracanie.deleteMany({ link: req.params.id }, () => {
            res.redirect("/");
          });
      }
    );
  })();
});

router.get("/wybor", (req, res) => {
  res.render("wybor.pug", {});
});

module.exports = router;
