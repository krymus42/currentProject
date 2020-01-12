require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ogloszenia_router = require("./routes/ogloszeniaRouter");
const miasta_router = require("./routes/miastaRouter");
const mongoose = require("mongoose");
const uzytkownicy_router = require("./routes/uzytkownicyRouter");
const location_router = require("./routes/locationRouter");
const anonseRouter = require("./routes/anonseRouter");
const panelRouter = require("./routes/panelRouter");
const modelkiRouter = require("./routes/modelkiRouter");
const cookieSession = require("@authentication/cookie-session");
const jezyki = require("./Schemes/languages/languages");
const adminPanelRouter = require("./routes/adminPanelRouter");
mongoose.connect("mongodb://localhost:27017/silesiaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
app.use(cookieSession({ maxAge: 1000 * 60 * 60 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("pug", require("pug").__express);
app.use(express.static("./public"));
app.use(async function(req, res, next) {
  const nazwa = req.get("accept-language").includes("pl-PL")
    ? "Polski"
    : req.get("accept-language").includes("de")
    ? "niemiecki"
    : "angielski";
  let jezyk = await jezyki.findOne({ nazwa: nazwa });
  req.session.language = jezyk;
  const json = req.session.language.logowanie;
  next();
});

app.get("/", (req, res) => res.render("panelAdmina.pug", {}));

app.use("/anonse", anonseRouter);
app.use("/location", location_router);
app.use("/uzytkownicy", uzytkownicy_router);
app.use("/miasta", miasta_router);
app.use("/ogloszenia", ogloszenia_router);
app.use("/modelki", modelkiRouter);
app.use("/panel", panelRouter);
app.use("/adminPanel", adminPanelRouter);
app.listen(8080, (req, res) => {
  console.log("I'm listening");
});
