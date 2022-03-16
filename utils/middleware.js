const logger = require("./logger");

const requestInfo = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:", req.path);
  logger.info("Body:", req.body);
  logger.info("---");
  next();
};

const unknownRoute = (req, res) => {
  res.status(404).send({ error: "unknown route" });
};

const errorHandler = (err, req, res, next) => {
  logger.mistake(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "wrong format ID" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "incorrect token" });
  }
  next(err);
};

module.exports = { requestInfo, unknownRoute, errorHandler };
