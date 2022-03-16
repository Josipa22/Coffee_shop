const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const db = require("./db");
const loginRouter = require("./controllers/login");
const korisniciRouter = require("./controllers/korisnici");
const reviewsRouter = require("./controllers/reviews");
const coffeesRouter = require("./controllers/coffees");

db();

app.use(cors());
app.use(express.json());
app.use(middleware.requestInfo);

const router = express.Router();
router.use(loginRouter);
router.use((req, res, next) => {
  next();
});
router.use("/korisnici", korisniciRouter);
router.use("/reviews", reviewsRouter);
router.use("/coffees", coffeesRouter);
app.use("/api", router);

app.use(middleware.unknownRoute);
app.use(middleware.errorHandler);

module.exports = app;
