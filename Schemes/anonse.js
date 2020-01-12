const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: String,
  tytul: String,
  tresc: String,
  data_dodania: Date,
  email: String,
  telefon: String,
  telefon_2: String,
  strona_www: String,
  wlasny_lokal: String,
  cena_za_30: Number,
  cena_za_60: Number,
  cena_za_90: Number,
  cena_za_noc: Number,
  wyjazdy: String,
  koszt_dojazdu: Number,
  godziny_pracy: {
    poniedzialek: {
      od: Number,
      do: Number
    },
    wtorek: {
      od: Number,
      do: Number
    },
    sroda: {
      od: Number,
      do: Number
    },
    czwartek: {
      od: Number,
      do: Number
    },
    piatek: {
      od: Number,
      do: Number
    },
    sobota: {
      od: Number,
      do: Number
    },
    niedziela: {
      od: Number,
      do: Number
    },
    swieta: {
      od: Number,
      do: Number
    }
  },
  uslugi: [String],
  adres_miasto: String,
  adres_wojewodztwo: String,
  data_modyfikacji: Date,
  modelka: mongoose.Types.ObjectId
});

module.exports = mongoose.model("anonse", Schema, "anonse");
