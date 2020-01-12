const express = require("express");
const router = express.Router();
const uslugi = require("../Schemes/uslugi");

router.get("/", async (req, res) => {
  const rows = await uslugi.find();
  const headers = Object.keys(rows[0]._doc);

  console.log(headers);

  res.render("panelAdmina.pug", { headers: headers, rows: rows });
});

module.exports = router;
