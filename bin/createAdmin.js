const db = require("../db");
const createUser = require("../utils/createUser");
const logger = require("../utils/logger");

async function createAdmin() {
  await db();
  const data = {
    email: "mima2@gmail.com",
    pass: "123456",
    admin: true,
  };

  const user = await createUser(data);
  logger.info1("Created user", user);
}

createAdmin();
