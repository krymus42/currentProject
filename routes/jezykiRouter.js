const express = require("express");
const router = express.Router();
const jezyki = require("../Schemes/jezyki");

router.get("/", (req, res) => {
  res.send(jezyki.find());
});

router.post("/dodaj", (req, res) => {
  const nazwa = req.body.nazwa;
  if (nazwa == null)
    res.render("../public/error.pug", { error: "Niekompletny formularz" });
  else if (jezyki.findOne({ nazwa: nazwa }) != null)
    res.render(("error.pug", { error: "Taki język jest już w bazie danych" }));
  else {
    jezyki.create({ nazwa: nazwa });
    res.redirect("/");
  }
});

router.post("/:id", (req, res) => {
  jezyki.delete({ id: req.params.id });
});

router.get("/:id", (req, res) => {
  const jezyk = jezyki.findOne({ id: req.params.id });
  if (jezyk == null)
    res.render("error.pug", { error: "Nie znaleziono takiego języka w bazie" });
  else res.send(jezyk); // zmien potem na renderowanie strony jezyka
});

module.exports = router;
