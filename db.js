const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("I am connecting to", config.DB_URI);

function connect() {
  return mongoose
    .connect(config.DB_URI)
    .then((result) => {
      logger.info("we are connected to base");
    })
    .catch((error) => {
      logger.mistake("Mistake", error.message);
    });
}

module.exports = connect;
