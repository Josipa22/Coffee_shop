const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Korisnik = require("../models/korisnik");

loginRouter.post("/login", async (req, res) => {
  const data = req.body;

  const korisnik = await Korisnik.findOne({ email: data.email });

  const passOk =
    korisnik === null
      ? false
      : await bcrypt.compare(data.pass, korisnik.passHash);

  if (!korisnik) {
    return res.status(401).json({
      error: "incorrect user",
    });
  }

  if (!passOk) {
    return res.status(401).json({
      error: "incorrect password",
    });
  }

  const korisnikToken = {
    email: korisnik.email,
    id: korisnik._id,
  };

  const token = jwt.sign(korisnikToken, process.env.SECRET);

  res.status(200).send({
    token,
    email: korisnik.email,
  });
});

module.exports = loginRouter;
