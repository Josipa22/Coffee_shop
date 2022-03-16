const reviewsRouter = require("express").Router();
const Review = require("../models/review");
const Korisnik = require("../models/korisnik");
const jwt = require("jsonwebtoken");

const catchToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer")) {
    return auth.substring(7);
  }
  return null;
};

reviewsRouter.get("/", async (req, res) => {
  const reviews = await Review.find({}).populate("korisnik", { email: 1 });
  res.json(reviews);
});

reviewsRouter.get("/:id", (req, res, next) => {
  Review.findById(req.params.id)
    .then((review) => {
      if (review) {
        res.json(review);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

reviewsRouter.delete("/:id", async (req, res) => {
  const token = catchToken(req);
  const id = req.params.id;
  const dekToken = jwt.verify(token, process.env.SECRET);

  if (!token || !dekToken.id) {
    return res.status(401).json({ error: "incorrect or nonexistent token" });
  }

  const korisnik = await Korisnik.findById(dekToken.id);
  const data = await Review.findById(id);

  if (
    String(korisnik._id) !== String(data.korisnik) &&
    korisnik.admin == false
  ) {
    return res.status(401).json({ error: "impossible to delete" });
  }

  await Review.findByIdAndRemove(id);

  res.status(204).end();
});

reviewsRouter.put("/:id", async (req, res) => {
  const token = catchToken(req);
  const dekToken = jwt.verify(token, process.env.SECRET);

  if (!token || !dekToken.id) {
    return res.status(401).json({ error: "incorrect or nonexistent token" });
  }

  const id = req.params.id;
  const korisnik = await Korisnik.findById(dekToken.id);
  const data = await Review.findById(id);

  if (String(korisnik._id) !== String(data.korisnik)) {
    return res.status(401).json({ error: "impossible to update" });
  }

  const datas = req.body;

  const review = {
    content: datas.content,
    grade: datas.grade,
  };

  newReview = await Review.findByIdAndUpdate(id, review);

  res.json(newReview);
});

reviewsRouter.post("/", async (req, res, next) => {
  const data = req.body;
  const token = catchToken(req);
  const dekToken = jwt.verify(token, process.env.SECRET);

  const korisnik = await Korisnik.findById(data.korisnikId);
  const admin = korisnik.admin;

  if (admin == true)
    return res
      .status(401)
      .json({ error: "admins are not allowed to leave reviews" });

  if (!token || !dekToken.id) {
    return res.status(401).json({ error: "incorrect or nonexistent token" });
  }

  const review = new Review({
    content: data.content,
    grade: data.grade,
    date: new Date(),
    korisnik: korisnik._id,
  });

  const storedReview = await review.save();
  korisnik.reviews = korisnik.reviews.concat(storedReview._id);
  await korisnik.save();

  res.json(storedReview);
});

module.exports = reviewsRouter;
