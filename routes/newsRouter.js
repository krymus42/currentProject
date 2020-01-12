const express = require("express");
const router = express.Router();
const ogloszenia = require("../Schemes/ogloszenia");

router.get("/", (req, res) => {
  const response = ogloszenia.find();
  res.render("ogloszenia.pug", { ogloszenia: response });
});

router.post("/dodaj", (req, res) => {
  ogloszenia.create({ ...req.body });
});

module.exports = router;
