const coffeesRouter = require("express").Router();
const Coffee = require("../models/coffee");
const Korisnik = require("../models/korisnik");
const jwt = require("jsonwebtoken");

const catchToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer")) {
    return auth.substring(7);
  }
  return null;
};

coffeesRouter.get("/", async (req, res) => {
  const coffees = await Coffee.find({}).populate("korisnik", {
    email: 1,
  });
  res.json(coffees);
});

coffeesRouter.get("/:id", (req, res) => {
  Coffee.findById(req.params.id)
    .then((coffee) => {
      if (coffee) {
        res.json(coffee);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

coffeesRouter.delete("/:id", async (req, res) => {
  const token = catchToken(req);
  const id = req.params.id;
  const dekToken = jwt.verify(token, process.env.SECRET);

  if (!token || !dekToken.id) {
    return res.status(401).json({ error: "incorrect or nonexistent token" });
  }

  const korisnik = await Korisnik.findById(dekToken.id);
  console.log(dekToken.id);
  console.log(korisnik._id);
  const data = await Coffee.findById(id);
  console.log(data.korisnik);

  if (String(korisnik._id) !== String(data.korisnik)) {
    return res.status(401).json({ error: "impossible to delete" });
  }

  await Coffee.findByIdAndRemove(id);

  res.status(204).end();
});

coffeesRouter.put("/:id", async (req, res) => {
  const token = catchToken(req);
  const dekToken = jwt.verify(token, process.env.SECRET);

  if (!token || !dekToken.id) {
    return res.status(401).json({ error: "incorrect or nonexistent token" });
  }

  const id = req.params.id;
  const korisnik = await Korisnik.findById(dekToken.id);
  const data = await Coffee.findById(id);

  if (String(korisnik._id) !== String(data.korisnik)) {
    return res.status(401).json({ error: "impossible to update" });
  }

  const datas = req.body;

  const coffee = {
    name: datas.name,
    about: datas.about,
  };

  newCoffee = await Coffee.findByIdAndUpdate(id, coffee);

  res.json(newCoffee);
});

coffeesRouter.post("/", async (req, res, next) => {
  const data1 = req.body;
  const token = catchToken(req);
  const dekToken = jwt.verify(token, process.env.SECRET);
  const korisnik = await Korisnik.findById(data1.korisnikId);

  const adminn = korisnik.admin;

  if (adminn == false)
    return res
      .status(401)
      .json({ error: "you need to be admin to post new coffees" });

  if (!token || !dekToken.id) {
    return res.status(401).json({ error: "incorrect or nonexistent token" });
  }

  const coffee = new Coffee({
    name: data1.name,
    about: data1.about,
    date: new Date(),
    korisnik: korisnik._id,
  });

  const storedCoffee = await coffee.save();
  korisnik.coffees = korisnik.coffees.concat(storedCoffee._id);
  await korisnik.save();

  res.json(storedCoffee);
});

module.exports = coffeesRouter;
