const sequelize = require("../utils/connection");
require("../models/User");
const User = require("../models/User");
require("../models/Category");
require("../models/Product");
require("../models/Cart");
require("../models");

const main = async () => {
  try {
    await sequelize.sync({ force: true });
    await User.create({
      firstName: "Bot",
      lastName: "User",
      email: "bot-user@gmail.com",
      password: "bot1234",
      phone: "1133445566",
    });
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
