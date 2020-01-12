const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/:lat/:lon", (req, res) => {
  const city = (async () => {
    const lat = req.params.lat;
    const lon = req.params.lon;
    if (lon == null || lat == null) {
      res.render("error.pug", { error: "Błąd geolokalizacji" });
      return;
    }
    const link = `https://eu1.locationiq.com/v1/reverse.php?key=${process.env.API_KEY}&lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(link);
    const json = await response.json();
    res.send(json.address.city);
  })();
});

module.exports = router;
