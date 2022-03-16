const bcrypt = require("bcrypt");
const korisniciRouter = require("express").Router();
const Korisnik = require("../models/korisnik");
const createUser = require("../utils/createUser");

korisniciRouter.get("/", async (req, res) => {
  const korisnici = await Korisnik.find({}).populate("reviews", "coffees", {
    name: 1,
    about: 1,
    date: 1,
  });
  res.json(korisnici);
});

korisniciRouter.post("/", async (req, res) => {
  const user = {
    email: req.body.email,
    pass: req.body.pass,
  };

  const newUser = await createUser(user);

  res.json(newUser);
});

module.exports = korisniciRouter;
